# vite-plugin-file-mock [![npm](https://img.shields.io/npm/v/vite-plugin-file-mock.svg)](https://npmjs.com/package/vite-plugin-file-mock)

> File system based local mock plugin for vite

**English** | [中文](./README.zh_CN.md)

## Table of Contents

-   [Usage](#usage)
-   [Options](#options)
-   [Overview](#overview)
-   [Customize Content](#customize-content)
-   [TypeScript And ESM Support](#typescript-and-esm-support)
-   [Async Function](#async-function)
-   [Ignore Interface](#ignore-interface)

## Usage

```shell
yarn add vite-plugin-file-mock -D
# or
npm i vite-plugin-file-mock -D
```

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
See [example](./example/) for more detail

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

## Overview

By default, the plugin will select all `.js` and `.ts`(and `.mjs` or `.cjs`, `.mts` and `.cts` dont support yet) files in the vite root `mock` folder to generate mock data, the api url is just the file path

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

## Customize Content
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

## TypeScript And ESM Support

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

## Async Function

mock can also support async function, so that you can do more thing;

```js
async function delay(time) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    });
}

// return data after 5 second
export default async () => {
    const data = {
        result: 1,
    };

    await delay(5000);

    return data;
};
```

## Ignore Interface

Sometimes we dont want the data from local, you can do this in two ways

1. comment the file

```js
// home.js
// export default {
//     result: 1,
// };
```

2. return undefined

```js
// home.js
export default {
    result: 1,
} && undefined;
```

