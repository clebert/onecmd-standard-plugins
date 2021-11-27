import {dirname, resolve} from 'path';
import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';
import {isObject} from '../predicates/is-object';
import {isStringArray} from '../predicates/is-string-array';
import {serializeJson} from '../serializers/serialize-json';
import {serializeLines} from '../serializers/serialize-lines';

export const prettier = (): Plugin => ({
  setup: () => [
    {
      type: 'new',
      path: '.prettierignore',
      is: isStringArray,

      create: (otherFiles) =>
        Object.entries(otherFiles)
          .filter(([, {pretty}]) => !pretty)
          .map(([path]) => path),

      serialize: serializeLines,
    },

    {
      type: 'new',
      path: '.prettierrc.json',
      is: isObject,

      create: () => ({
        bracketSpacing: false,
        printWidth: 80,
        proseWrap: 'always',
        quoteProps: 'consistent',
        singleQuote: true,
      }),

      serialize: serializeJson,
    },

    {
      type: 'mod',
      path: '.editorconfig',
      is: isStringArray,

      update: (content) => [
        ...(content as string[]),
        '[*.{html,js,json,md,ts,tsx,yml}]',
        'charset = unset',
        'end_of_line = unset',
        'indent_size = unset',
        'indent_style = unset',
        'insert_final_newline = unset',
        'trim_trailing_whitespace = unset',
      ],
    },

    {
      type: 'mod',
      path: '.eslintrc.json',
      is: isObject,
      update: (content) => deepmerge(content, {extends: ['prettier']}),
    },

    {
      type: 'mod',
      path: '.vscode/extensions.json',
      is: isObject,

      update: (content) =>
        deepmerge(content, {recommendations: ['esbenp.prettier-vscode']}),
    },

    {
      type: 'mod',
      path: '.vscode/settings.json',
      is: isObject,
      update: (content) => deepmerge(content, {'editor.formatOnSave': true}),
    },
  ],

  format: ({check}) => [
    {
      command: resolve(dirname(require.resolve('prettier')), 'bin-prettier.js'),

      args: [
        check ? '--list-different' : '--write',
        '**/*.{html,js,json,md,ts,tsx,yml}',
      ],
    },
  ],
});
