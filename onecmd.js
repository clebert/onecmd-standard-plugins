// @ts-check

const plugins = require('./lib/cjs/index.js');

module.exports = [
  plugins.editorconfig(),
  plugins.eslint(),
  plugins.git(),
  plugins.node('16'),
  plugins.npm(),
  plugins.prettier(),
  plugins.typescript('node', 'package'),
  plugins.vscode({showFilesInEditor: false}),
];
