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

## Plugins

### babel

```ts
function babel(): Plugin;
```

- Source file `.babelrc.json` of type `object`

### editorconfig

```ts
function editorconfig(): Plugin;
```

- Source file `.editorconfig` of type `object` _(string array)_
- Optional dependency file `.vscode/extensions.json` of type `object`

### eslint

```ts
function eslint(): Plugin;
```

- **Command** of type `lint`
- Source file `.eslintignore` of type `object` _(string array)_
- Source file `.eslintrc.json` of type `object`
- Optional dependency file `.vscode/extensions.json` of type `object`

### git

```ts
function git(): Plugin;
```

- Versionable source file `.gitignore` of type `object` _(string array)_

### github

```ts
function github({
  branches = ['main'],
  nodeVersion = undefined,
  omitReleaseStep = false,
  runner = 'ubuntu-latest',
}?: GithubPluginOptions): Plugin;
```

- Versionable source file `.github/workflows/ci.yml` of type `object`

### jest

```ts
function jest({coverage = false}?: JestPluginOptions): Plugin;
```

- **Command** of type `test`
- Source file `jest.config.json` of type `object`
- Source file `coverage` of type `unknown` (coverage=true)

### node

```ts
function node(version: string): Plugin;
```

- Source file `.node-version` of type `string`
- Optional dependency file `.babelrc.json` of type `object`

### npm

```ts
function npm(): Plugin;
```

- Source file `node_modules` of type `unknown`
- Versionable source file `package-lock.json` of type `unknown`
- Versionable source file `package.json` of type `unknown`

### preact

```ts
function preact(): Plugin;
```

- Optional dependency file `tsconfig.json` of type `object`

### prettier

```ts
function prettier(): Plugin;
```

- **Command** of type `fmt`
- Source file `.prettierignore` of type `object` _(string array)_
- Source file `.prettierrc.json` of type `object`
- Optional dependency file `.vscode/extensions.json` of type `object`
- Optional dependency file `.vscode/settings.json` of type `object`
- Optional dependency file `.eslintrc.json` of type `object`
- Optional dependency file `.editorconfig` of type `object`

### react

```ts
function react(): Plugin;
```

- Optional dependency file `.babelrc.json` of type `object`
- Optional dependency file `tsconfig.json` of type `object`

### typescript

```ts
function typescript(arch: 'node' | 'web', dist: 'bundle' | 'package'): Plugin;
```

- **Command** of type `compile`
- Source file `tsconfig.json` of type `object`
- Source file `tsconfig.cjs.json` of type `object` _(dist=package)_
- Source file `tsconfig.esm.json` of type `object` _(dist=package)_
- Source file `lib` of type `unknown` _(dist=package)_
- Optional dependency file `.vscode/settings.json` of type `object`
- Optional dependency file `.eslintrc.json` of type `object`
- Optional dependency file `.babelrc.json` of type `object`

### vscode

```ts
function vscode({showFilesInEditor = false}?: VscodePluginOptions): Plugin;
```

- Source file `.vscode/extensions.json` of type `object`
- Source file `.vscode/settings.json` of type `object`
- Source file `.vscode` of type `unknown`

---

Copyright 2021 Clemens Akens. All rights reserved.
[MIT license](https://github.com/clebert/onecmd-standard-plugins/blob/master/LICENSE.md).
