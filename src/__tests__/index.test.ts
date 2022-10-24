import { getContent } from '../index';
import { resolve } from 'path';

const path = 'src/__tests__/';
const response = { result: 1 };

describe('vite-plugin-mock getContent', () => {
    test('ts', async () => {
        await expect(getContent(resolve(path, './mock/ts/ts-func.ts'))).resolves.toEqual(response);
        await expect(getContent(resolve(path, './mock/ts/ts-json.ts'))).resolves.toEqual(response);
    });

    // test('mts', () => {
    //     expect(getContent(resolve(path, './mock/ts/ts-json.mts'))).toEqual(response);
    // });

    // test('cts', () => {
    //     expect(getContent(resolve(path, './mock/ts/ts-json.cts'))).toEqual(response);
    // });

    test('esm', async () => {
        await expect(getContent(resolve(path, './mock/esm/esm-func.js'))).resolves.toEqual(response);
        await expect(getContent(resolve(path, './mock/esm/esm-json.js'))).resolves.toEqual(response);
        await expect(getContent(resolve(path, './mock/esm/esm-json.mjs'))).resolves.toEqual(response);
    });

    test('cjs', async () => {
        await expect(getContent(resolve(path, './mock/cjs/cjs-func.js'))).resolves.toEqual(response);
        await expect(getContent(resolve(path, './mock/cjs/cjs-json.js'))).resolves.toEqual(response);
        await expect(getContent(resolve(path, './mock/cjs/cjs-json.cjs'))).resolves.toEqual(response);
    });

    test('ignore comment', async () => {
        await expect(getContent(resolve(path, './mock/ignore/comment.js'))).resolves.toEqual({});
    });

    test('ignore undefined', async () => {
        await expect(getContent(resolve(path, './mock/ignore/undefined.js'))).resolves.toBeUndefined();
    });
});
