import {dirname, resolve} from 'path';
import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';
import {serializeJson} from './util/serialize-json';
import {serializeLines} from './util/serialize-lines';

export const prettier = (): Plugin => ({
  commands: [
    {
      type: 'fmt',
      path: resolve(dirname(require.resolve('prettier')), 'bin-prettier.js'),

      getArgs: ({check}) => [
        check ? '--list-different' : '--write',
        '**/*.{html,js,json,md,ts,tsx,yml}',
      ],
    },
  ],
  sources: [
    {
      type: 'object',
      path: '.prettierignore',
      generate: (otherSources) => Object.keys(otherSources),
      serialize: serializeLines,
    },
    {
      type: 'object',
      path: '.prettierrc.json',

      generate: () => ({
        bracketSpacing: false,
        printWidth: 80,
        proseWrap: 'always',
        quoteProps: 'consistent',
        singleQuote: true,
      }),

      serialize: serializeJson,
    },
  ],
  dependencies: [
    {
      type: 'object',
      path: '.vscode/extensions.json',

      generate: (input) =>
        deepmerge(input, {recommendations: ['esbenp.prettier-vscode']}),
    },
    {
      type: 'object',
      path: '.vscode/settings.json',
      generate: (input) => deepmerge(input, {'editor.formatOnSave': true}),
    },
    {
      type: 'object',
      path: '.eslintrc.json',
      generate: (input) => deepmerge(input, {extends: ['prettier']}),
    },
    {
      type: 'object',
      path: '.editorconfig',

      generate: (input) => [
        ...(input as string[]),
        '[*.{html,js,json,md,ts,tsx,yml}]',
        'insert_final_newline = false',
        'trim_trailing_whitespace = false',
      ],
    },
  ],
});
