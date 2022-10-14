import { getContent } from '../index';
import { resolve } from 'path';

const path = 'src/__tests__/';
const response = { result: 1 };

describe('vite-plugin-mock getContent', () => {
    test('ts', () => {
        expect(getContent(resolve(path, './mock/ts-func.ts'))).toEqual(response);
        expect(getContent(resolve(path, './mock/ts-json.ts'))).toEqual(response);
    });

    // test('mts', () => {
    //     expect(getContent(resolve(path, './mock/ts-json.mts'))).toEqual(response);
    // });

    // test('cts', () => {
    //     expect(getContent(resolve(path, './mock/ts-json.cts'))).toEqual(response);
    // });

    test('esm', () => {
        expect(getContent(resolve(path, './mock/esm-func.js'))).toEqual(response);
        expect(getContent(resolve(path, './mock/esm-json.js'))).toEqual(response);
        expect(getContent(resolve(path, './mock/esm-json.mjs'))).toEqual(response);
    });

    test('cjs', () => {
        expect(getContent(resolve(path, './mock/cjs-func.js'))).toEqual(response);
        expect(getContent(resolve(path, './mock/cjs-json.js'))).toEqual(response);
        expect(getContent(resolve(path, './mock/cjs-json.cjs'))).toEqual(response);
    });
});
