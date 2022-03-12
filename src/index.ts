import glob from 'fast-glob';
import { resolve } from 'path';
import type { ViteDevServer, Plugin, ResolvedConfig } from 'vite';
import debug from 'debug';

const log = debug('vite-plugin-file-mock');
const defaultDir = 'mock';

export interface MockPluginOptions {
    dir?: string;
    enable?: boolean;
    refreshOnSave?: boolean;
}

function getApiList(mockDirPath: string) {
    const files = glob.sync('**/*.{js,ts}', {
        cwd: mockDirPath,
        onlyFiles: true,
    });
    return files.map((item) => ({
        url: `/${item.slice(0, item.length - 3)}`,
        path: resolve(mockDirPath, item),
    }));
}

function handleMock(server: ViteDevServer, root: string, options: MockPluginOptions) {
    const mockDirPath = resolve(root, options.dir!);
    const apiList = getApiList(mockDirPath);
    server.middlewares.use((request, response, next) => {
        const currentApi = apiList.find((item) => item.url === request.url);
        if (!currentApi) {
            next();
            return;
        }
        try {
            const requireContent = require(currentApi.path);
            const result = typeof requireContent === 'function' ? requireContent(request) : requireContent;
            response.setHeader('Content-Type', 'text/json');
            response.statusCode = 200;
            response.end(JSON.stringify(result));
        } catch (e) {
            next();
        }
    });

    // 实时响应mock文件的修改
    ['add', 'onlink', 'change'].forEach((event) => {
        server.watcher.on(event, (path: string) => {
            if (path.startsWith(mockDirPath)) {
                log(`File ${path} has been ${event}`);
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete require.cache[path];
                if (options.refreshOnSave) {
                    server.ws.send({
                        type: 'full-reload',
                    });
                }
            }
        });
    });
}

const defaultOptions: MockPluginOptions = {
    enable: true,
    refreshOnSave: true,
    dir: defaultDir,
};

export default function mockPlugin(options?: MockPluginOptions): Plugin {
    let viteRoot: string;
    const resolvedOptions: MockPluginOptions = { ...defaultOptions, ...(options ?? {}) };
    return {
        name: 'vite-plugin-file-mock',
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
