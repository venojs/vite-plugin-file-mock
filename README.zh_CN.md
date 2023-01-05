# vite-plugin-mock [![npm](https://img.shields.io/npm/v/vite-plugin-file-mock.svg)](https://npmjs.com/package/vite-plugin-file-mock)

> 基于文件系统的mock插件

**中文** | [English](./README.md)

## 目录

-   [安装与使用](#安装与使用)
-   [选项](#选项)
-   [概览](#概览)
-   [自定义内容](#自定义内容)
-   [TypeScript 和 ESM 支持](#typescript-和-esm-支持)
-   [异步函数](#异步函数)
-   [忽略指定接口](#忽略指定接口)

## 安装与使用
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

可以看看这个[例子](./example/)

## 选项
### dir
- **Type:** `string`
- **Default:** `mock`

本地mock文件所在的路径, 相对于vite root, 默认是vite root下的mock文件夹

### enable
- **Type:** `boolean`
- **Default:** `true`

是否开启mock功能
此插件只在`serve`阶段生效

### refreshOnSave
- **Type:** `boolean`
- **Default:** `true`

当mock文件变更, 是否刷新浏览器

### noRefreshUrlList

-   **Type:** `Array<string | RegExp>`
-   **Default:** `[]`

refreshOnSave 会自动开启，当有些接口不想自动刷新页面时，可以放这里，支持正则

## 概览

插件会默认选择根目录`/mock`文件夹下所有的`.js`和`.ts`(也可以是`.mjs` `.cjs`, 暂不支持`.mts` `.cts`)文件来生成mock数据, 文件路径即接口

```
mock/
  ├── api/
  │  ├── home.js
  │  ├── user.js
```
如上目录结构将生成两条接口`/api/home`和`/api/user`

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
mock文件可以直接返回数据, 这样任何请求`/api/home`都将返回相同的数据

## 自定义内容
有时候我们需要自定义返回的内容, 比如
* mock rest接口
* 根据参数来动态返回内容
* 使用[faker.js](https://github.com/faker-js/faker)来辅助内容生成
* ...

这时候, 可以让mock文件返回一个函数, 函数里再返回我们需要自定义的内容
也可以直接使用 `response` 来定义 `statusCode`, `header`, `data` 等

> 如果函数里没有调用 response.end, 则函数的返回值会作为最终 response 返回的值
```js
// user.js
module.exports = (request, response) => {
    if (request.method === 'GET') {
    return {
        result: 1,
        method: request.method,
    }
  } else if (request.method === 'POST') {
    return {
        result: 2,
        method: request.method,
    }
  } else {
    response.statusCode = 500;
    response.end(JSON.stringify({
        result: 3,
        method: request.method,
    }));
  }
}
```

## TypeScript 和 ESM 支持

mock 文件同时`.js`和`.ts`, `.js`既可以是 `commonjs`, 也可以是 `esm`

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

## 异步函数

mock 文件也支持异步函数, 这样允许用更多的自定义

```js
async function delay(time) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    });
}

// 5秒后返回数据
export default async () => {
    const data = {
        result: 1,
    };

    await delay(5000);

    return data;
};
```

## 忽略指定接口

忽略指定接口有两种做法：

1. 把整个文件注释

```js
// home.js
// export default {
//     result: 1,
// };
```

2. 返回 undefined

```js
// home.js
export default {
    result: 1,
} && undefined;
```
