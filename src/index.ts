import glob from 'fast-glob';
import createJITI from 'jiti';
import { resolve, extname } from 'path';
import type { ViteDevServer, Plugin, ResolvedConfig, Connect } from 'vite';
import type { ServerResponse } from 'node:http';
import debug from 'debug';

const pluginName = 'vite-plugin-file-mock';

const log = debug(pluginName);
const defaultDir = 'mock';
const jiti = createJITI('', {
    // 清楚ts和esm的缓存
    requireCache: false,
});
// 用于清除cjs缓存
const nativeRequire = createJITI('');

interface ApiList {
    url: string;
    path: string;
}
let apiList: ApiList[] = [];

export interface MockPluginOptions {
    dir?: string;
    enable?: boolean;
    refreshOnSave?: boolean;
    noRefreshUrlList?: Array<string | RegExp>;
}

function createReg(condition: Array<RegExp | string>): RegExp | null {
    const arr = condition
        .filter((item: RegExp | string) => !!item)
        .map((item: RegExp | string) => {
            if (item instanceof RegExp) {
                return item.source;
            }
            return item;
        });
    if (arr.length) {
        return new RegExp(arr.join('|'));
    }
    return null;
}

function isMatch(reg: RegExp | null, str: string) {
    return reg && reg.test(str);
}

function getApiList(mockDirPath: string): ApiList[] {
    const files = glob.sync('**/*.{js,cjs,mjs,ts}', {
        cwd: mockDirPath,
        onlyFiles: true,
    });
    return files.map((item) => ({
        url: `/${item.slice(0, item.length - extname(item).length)}`,
        path: resolve(mockDirPath, item),
    }));
}

export async function getContent(path: string, request?: Connect.IncomingMessage, response?: ServerResponse) {
    let content = jiti(path);
    if (content && content.__esModule) {
        content = content.default;
    }
    if (typeof content === 'function') {
        return content(request, response);
    }
    return content;
}

function handleMock(server: ViteDevServer, root: string, options: MockPluginOptions) {
    const mockDirPath = resolve(root, options.dir!);

    apiList = getApiList(mockDirPath);

    const noRefreshReg = createReg(options.noRefreshUrlList ?? []);
    server.middlewares.use(async (request, response, next) => {
        const realUrl = request.url?.split('?')[0] ?? '';
        const currentApi = apiList.find((item) => item.url === realUrl);
        if (!currentApi) {
            return next();
        }
        try {
            const result = await getContent(currentApi.path, request, response);
            if (!response.writableEnded) {
                // 文件内容全部注释getContent解析出来为{}
                // export default {} && undefined, getContent解析出来为undefined
                if (typeof result === 'undefined' || Object.keys(result).length === 0) {
                    return next();
                }
                if (!response.hasHeader('Content-Type')) {
                    response.setHeader('Content-Type', 'application/json');
                }
                response.statusCode = response.statusCode ?? 200;
                response.end(JSON.stringify(result));
            }
        } catch (e) {
            // 在控制台打出报错信息, 给用户明确的提示
            console.log(`${pluginName} error when requesting ${realUrl}:\n`, e);
            next();
        }
    });

    // 实时响应mock文件的修改
    ['add', 'unlink', 'change'].forEach((event) => {
        server.watcher.on(event, (path: string) => {
            if (path.startsWith(mockDirPath)) {
                // 文件增加和删除时更新下apiList
                if (['add', 'unlink'].includes(event)) {
                    apiList = getApiList(mockDirPath);
                }
                log(`File ${path} has been ${event}`);
                delete nativeRequire.cache[path];
                const url = apiList.find((item) => item.path === path)?.url ?? '';
                if (options.refreshOnSave) {
                    if (isMatch(noRefreshReg, url)) {
                        log(`File ${path} match noRefreshUrlList`);
                    } else {
                        server.ws.send({
                            type: 'full-reload',
                        });
                    }
                }
            }
        });
    });
}

const defaultOptions: MockPluginOptions = {
    dir: defaultDir,
    enable: true,
    refreshOnSave: true,
    noRefreshUrlList: [],
};

export default function mockPlugin(options?: MockPluginOptions): Plugin {
    let viteRoot: string;
    const resolvedOptions: MockPluginOptions = { ...defaultOptions, ...(options ?? {}) };
    return {
        name: pluginName,
        enforce: 'pre',
        apply: 'serve',
        configResolved({ root }: ResolvedConfig) {
            viteRoot = root;
        },
        configureServer(server: ViteDevServer) {
            if (resolvedOptions?.enable) {
                handleMock(server, viteRoot, resolvedOptions);
            }
        },
    };
}
