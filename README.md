# @onecmd/standard-plugins

[![][ci-badge]][ci-link] [![][version-badge]][version-link]
[![][license-badge]][license-link]

[ci-badge]:
  https://github.com/clebert/onecmd-standard-plugins/workflows/CI/badge.svg
[ci-link]: https://github.com/clebert/onecmd-standard-plugins
[version-badge]: https://badgen.net/npm/v/@onecmd/standard-plugins
[version-link]: https://www.npmjs.com/package/@onecmd/standard-plugins
[license-badge]: https://badgen.net/npm/license/@onecmd/standard-plugins
[license-link]:
  https://github.com/clebert/onecmd-standard-plugins/blob/master/LICENSE.md

A set of standard plugins for use with
[`onecmd`](https://github.com/clebert/onecmd).

## Installation

```
npm install @onecmd/standard-plugins --save-dev
```

## Usage

1. Install the standard plugins:
   `npm install @onecmd/standard-plugins --save-dev`
2. Create a file named `onecmd.js`:

```js
// @ts-check

const std = require('@onecmd/standard-plugins');
const nodeVersion = '16';

/** @type {readonly import('onecmd').Plugin[]} */
const plugins = [
  std.babel(),
  std.editorconfig(),
  std.eslint(),
  std.git(),
  std.github({nodeVersion}),
  std.jest({coverage: true}),
  std.node(nodeVersion),
  std.npm(),
  std.prettier(),
  std.typescript('node', 'package'),
  std.vscode({showFilesInEditor: false}),
];

module.exports = plugins;
```

3. Run: `onecmd setup`
4. Run: `onecmd compile && onecmd format --check && onecmd lint && onecmd test`

## Plugins

### babel

```ts
function babel(): Plugin;
```

- **setup**
  - `new` file `.babelrc.json` with content of type `object`

### editorconfig

```ts
function editorconfig(): Plugin;
```

- **setup**
  - `new` file `.editorconfig` with content of type `string[]`
  - `mod` file `.vscode/extensions.json` with content of type `object`
  - `mod` file `.vscode/settings.json` with content of type `object`

### eslint

```ts
function eslint(): Plugin;
```

- **lint**
- **setup**
  - `new` file `.eslintignore` with content of type `string[]`
  - `new` file `.eslintrc.json` with content of type `object`
  - `mod` file `.vscode/extensions.json` with content of type `object`

### git

```ts
function git(): Plugin;
```

- **setup**
  - `new` file `.gitignore` with content of type `string[]`

### github

```ts
function github({
  branches = ['main'],
  nodeVersion = undefined,
  omitReleaseStep = false,
  runner = 'ubuntu-latest',
}?: GithubPluginOptions): Plugin;
```

- **setup**
  - `new` file `.github/workflows/ci.yml` with content of type `object`

### jest

```ts
function jest({coverage = false}?: JestPluginOptions): Plugin;
```

- **test**
- **setup**
  - `new` file `jest.config.json` with content of type `object`
  - `ref` file `coverage`

### node

```ts
function node(version: string): Plugin;
```

- **setup**
  - `new` file `.node-version` with content of type `string`
  - `mod` file `.babelrc.json` with content of type `object`

### npm

```ts
function npm(): Plugin;
```

- **setup**
  - `ref` file `node_modules`
  - `ref` file `package-lock.json`
  - `ref` file `package.json`

### preact

```ts
function preact(): Plugin;
```

- **setup**
  - `mod` file `tsconfig.json` with content of type `object`

### prettier

```ts
function prettier(): Plugin;
```

- **format**
- **setup**
  - `new` file `.prettierignore` with content of type `string[]`
  - `new` file `.prettierrc.json` with content of type `object`
  - `mod` file `.editorconfig` with content of type `string[]`
  - `mod` file `.eslintrc.json` with content of type `object`
  - `mod` file `.vscode/extensions.json` with content of type `object`
  - `mod` file `.vscode/settings.json` with content of type `object`

### react

```ts
function react(): Plugin;
```

- **setup**
  - `mod` file `.babelrc.json` with content of type `object`
  - `mod` file `tsconfig.json` with content of type `object`

### typescript

```ts
function typescript(arch: 'node' | 'web', dist: 'bundle' | 'package'): Plugin;
```

- **compile**
- **setup**
  - `new` file `tsconfig.json` with content of type `object`
  - `new` file `tsconfig.cjs.json` with content of type `object`
    (`dist='package'`)
  - `new` file `tsconfig.esm.json` with content of type `object`
    (`dist='package'`)
  - `mod` file `.babelrc.json` with content of type `object`
  - `mod` file `.eslintrc.json` with content of type `object`
  - `mod` file `.vscode/settings.json` with content of type `object`
  - `ref` file `lib` (`dist='package'`)

### vscode

```ts
function vscode({showFilesInEditor = false}?: VscodePluginOptions): Plugin;
```

- **setup**
  - `new` file `.vscode/extensions.json` with content of type `object`
  - `new` file `.vscode/settings.json` with content of type `object`
  - `ref` file `.vscode`

---

Copyright 2021 Clemens Akens. All rights reserved.
[MIT license](https://github.com/clebert/onecmd-standard-plugins/blob/master/LICENSE.md).
