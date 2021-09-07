/* eslint-disable @typescript-eslint/require-await */

import {dirname, resolve} from 'path';
import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';

export const prettier = (): Plugin => ({
  commands: [
    {
      type: 'fmt',
      path: resolve(dirname(require.resolve('prettier')), 'bin-prettier.js'),

      getArgs({check}) {
        return [
          check ? '--list-different' : '--write',
          '**/*.{html,js,json,md,ts,tsx,yml}',
        ];
      },
    },
  ],
  sources: [
    {
      type: 'text',
      path: '.prettierignore',

      async generate(otherSources) {
        return Object.keys(otherSources);
      },
    },

    {
      type: 'json',
      path: '.prettierrc.json',

      async generate() {
        return {
          bracketSpacing: false,
          printWidth: 80,
          proseWrap: 'always',
          quoteProps: 'consistent',
          singleQuote: true,
        };
      },
    },
  ],
  dependencies: [
    {
      type: 'json',
      path: '.vscode/extensions.json',

      async generate(input) {
        return deepmerge(input, {recommendations: ['esbenp.prettier-vscode']});
      },
    },

    {
      type: 'json',
      path: '.vscode/settings.json',

      async generate(input) {
        return deepmerge(input, {'editor.formatOnSave': true});
      },
    },

    {
      type: 'json',
      path: '.eslintrc.json',

      async generate(input) {
        return deepmerge(input, {extends: ['prettier']});
      },
    },

    {
      type: 'text',
      path: '.editorconfig',

      async generate(input) {
        return deepmerge(input, [
          '[*.{html,js,json,md,ts,tsx,yml}]',
          'insert_final_newline = false',
          'trim_trailing_whitespace = false',
        ]);
      },
    },
  ],
});
