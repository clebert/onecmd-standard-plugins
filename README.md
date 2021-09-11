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

const plugins = require('@onecmd/standard-plugins');

module.exports = [
  plugins.babel(),
  plugins.editorconfig(),
  plugins.eslint(),
  plugins.git(),
  plugins.jest({coverage: true}),
  plugins.node('16'),
  plugins.npm(),
  plugins.prettier(),
  plugins.typescript('node', 'package'),
  plugins.vscode({showFilesInEditor: false}),
];
```

3. Run: `onecmd setup`
4. Run: `onecmd compile && onecmd fmt --check && onecmd lint && onecmd test`

## Plugins

### babel

```ts
function babel(): Plugin;
```

- Managed source file `.babelrc.json` of type `object`

### editorconfig

```ts
function editorconfig(): Plugin;
```

- Managed source file `.editorconfig` of type `string[]`
- Managed optional dependency file `.vscode/extensions.json` of type `object`
- Managed optional dependency file `.vscode/settings.json` of type `object`

### eslint

```ts
function eslint(): Plugin;
```

- **Command** of type `lint`
- Managed source file `.eslintignore` of type `string[]`
- Managed source file `.eslintrc.json` of type `object`
- Managed optional dependency file `.vscode/extensions.json` of type `object`

### git

```ts
function git(): Plugin;
```

- Managed versionable source file `.gitignore` of type `string[]`

### github

```ts
function github({
  branches = ['main'],
  nodeVersion = undefined,
  omitReleaseStep = false,
  runner = 'ubuntu-latest',
}?: GithubPluginOptions): Plugin;
```

- Managed versionable source file `.github/workflows/ci.yml` of type `object`

### jest

```ts
function jest({coverage = false}?: JestPluginOptions): Plugin;
```

- **Command** of type `test`
- Managed source file `jest.config.json` of type `object`
- Unmanaged source file `coverage` (`coverage=true`)

### node

```ts
function node(version: string): Plugin;
```

- Managed source file `.node-version` of type `string`
- Managed optional dependency file `.babelrc.json` of type `object`

### npm

```ts
function npm(): Plugin;
```

- Unmanaged source file `node_modules`
- Unmanaged versionable source file `package-lock.json`
- Unmanaged versionable source file `package.json`

### preact

```ts
function preact(): Plugin;
```

- Managed optional dependency file `tsconfig.json` of type `object`

### prettier

```ts
function prettier(): Plugin;
```

- **Command** of type `fmt`
- Managed source file `.prettierignore` of type `string[]`
- Managed source file `.prettierrc.json` of type `object`
- Managed optional dependency file `.vscode/extensions.json` of type `object`
- Managed optional dependency file `.vscode/settings.json` of type `object`
- Managed optional dependency file `.eslintrc.json` of type `object`
- Managed optional dependency file `.editorconfig` of type `string[]`

### react

```ts
function react(): Plugin;
```

- Managed optional dependency file `.babelrc.json` of type `object`
- Managed optional dependency file `tsconfig.json` of type `object`

### typescript

```ts
function typescript(arch: 'node' | 'web', dist: 'bundle' | 'package'): Plugin;
```

- **Command** of type `compile`
- Managed source file `tsconfig.json` of type `object`
- Managed source file `tsconfig.cjs.json` of type `object` (`dist='package'`)
- Managed source file `tsconfig.esm.json` of type `object` (`dist='package'`)
- Unmanaged source file `lib` (`dist='package'`)
- Managed optional dependency file `.vscode/settings.json` of type `object`
- Managed optional dependency file `.eslintrc.json` of type `object`
- Managed optional dependency file `.babelrc.json` of type `object`

### vscode

```ts
function vscode({showFilesInEditor = false}?: VscodePluginOptions): Plugin;
```

- Managed source file `.vscode/extensions.json` of type `object`
- Managed source file `.vscode/settings.json` of type `object`
- Unmanaged source file `.vscode`

---

Copyright 2021 Clemens Akens. All rights reserved.
[MIT license](https://github.com/clebert/onecmd-standard-plugins/blob/master/LICENSE.md).
