// @ts-check

const plugins = require('./lib/cjs/index.js');
const nodeVersion = '16';

module.exports = [
  plugins.editorconfig(),
  plugins.eslint(),
  plugins.git(),
  plugins.github({nodeVersion}),
  plugins.node(nodeVersion),
  plugins.npm(),
  plugins.prettier(),
  plugins.typescript('node', 'package'),
  plugins.vscode({showFilesInEditor: false}),
];
