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
  dir?: string; // default 'mock'
  enable?: boolean;
  refreshOnSave?: boolean; // default true
}
```
## Options
### dir
- **Type:** `string`
- **Default:** `mock`

the mock file dir relative to vite root, use mock by default

### enable
- **Type:** `boolean`
- **Default:** `true`

enable mock plugin or not
this plugin load only in `serve`

### refreshOnSave
- **Type:** `boolean`
- **Default:** `true`

when mock file change, the browser will be refresh

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
