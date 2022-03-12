# vite-plugin-mock

> File system based mock plugin for vite

**English** | [中文](./README.zh_CN.md)

## Getting Started

### Install
```shell
yarn add @veno/vite-plugin-mock -D
# or
npm i @veno/vite-plugin-mock -D
```

### Usage

```js
// vite.config.js
import mockPlugin from '@veno/vite-plugin-mock'

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
