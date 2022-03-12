# vite-plugin-file-mock [![npm](https://img.shields.io/npm/v/vite-plugin-file-mock.svg)](https://npmjs.com/package/vite-plugin-file-mock)

> File system based mock plugin for vite

**English** | [中文](./README.zh_CN.md)

## Getting Started

### Install
```shell
yarn add vite-plugin-file-mock -D
# or
npm i vite-plugin-file-mock -D
```

### Usage

```js
// vite.config.js
import mockPlugin from 'vite-plugin-file-mock'

export default {
  plugins: [
    mockPlugin(),
  ]
}
```

### Options
```ts
interface MockPluginOptions {
    dir?: string; // default 'mock'
    enable?: boolean;
    refreshOnSave?: boolean; // default true
}
```
