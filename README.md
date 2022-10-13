# vite-plugin-file-mock [![npm](https://img.shields.io/npm/v/vite-plugin-file-mock.svg)](https://npmjs.com/package/vite-plugin-file-mock)

> File system based local mock plugin for vite

**English** | [中文](./README.zh_CN.md)

## Install
```shell
yarn add vite-plugin-file-mock -D
# or
npm i vite-plugin-file-mock -D
```

## Usage

See [example](./example/) for more detail

```js
// vite.config.js
import mockPlugin from 'vite-plugin-file-mock'

export default {
  plugins: [
    mockPlugin(),
  ]
}
```

```ts
interface MockPluginOptions {
  dir?: string;
  enable?: boolean;
  refreshOnSave?: boolean;
  noRefreshUrlList?: Array<string | RegExp>;
}
```
## Options
### dir
- **Type:** `string`
- **Default:** `mock`

The mock file folder relative to vite root, use `mock` by default

### enable
- **Type:** `boolean`
- **Default:** `true`

Enable mock plugin or not.

This plugin load only in `serve`

### refreshOnSave
- **Type:** `boolean`
- **Default:** `true`

When mock file change, the browser will be refresh

### noRefreshUrlList

-   **Type:** `Array<string | RegExp>`
-   **Default:** `[]`

When some file change, you dont want to refresh the browser, you can use this.

## overview

By default, the plugin will select all `.js` and `.ts` files in the vite root `mock` folder to generate mock data, the api url is just the file path

```
mock/
  ├── api/
  │  ├── home.js
  │  ├── user.js
```
The above directory structure will generate two apis `/api/home` and `/api/user`

```js
// home.js
module.exports = {
  result: 1,
}
```
```js
fetch('/api/home')
  .then(response => response.json())
  .then(data => console.log(data)); // { result: 1}
```

## Customize content
Sometimes we need to customize the returned content, we can return a function to dynamic generate mock data
```js
// user.js
module.exports = (request) => {
  if (request.method === 'GET') {
    return {
      result: 1,
      method: request.method,
    }
  } else {
    return {
      result: 2,
      method: request.method,
    }
  }
}
```

## TypeScript And ESM support

This plugin can support `.js` and `.ts` both, `.js` file can be `commonjs` or `esm`

```js
// home.js commonjs
module.exports = {
    result: 1,
};
```

```js
// home.js esm
export default {
    result: 1,
};
```

```js
// home.ts
export default () => {
    return {
        result: 1
    }
}
```
