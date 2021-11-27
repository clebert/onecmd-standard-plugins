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
  std.editorconfig(),
  std.eslint(),
  std.git(),
  std.github({nodeVersion}),
  std.jest({coverage: true}),
  std.node(nodeVersion),
  std.npm(),
  std.prettier(),
  std.swc(),
  std.typescript('node', 'package'),
  std.vscode({showFilesInEditor: false}),
];

module.exports = plugins;
```

3. Run: `onecmd setup`
4. Run: `onecmd compile && onecmd format --check && onecmd lint && onecmd test`

---

Copyright 2021 Clemens Akens. All rights reserved.
[MIT license](https://github.com/clebert/onecmd-standard-plugins/blob/master/LICENSE.md).
