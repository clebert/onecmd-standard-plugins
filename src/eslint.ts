/* eslint-disable @typescript-eslint/require-await */

import {dirname, resolve} from 'path';
import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';

export const eslint = (): Plugin => ({
  commands: [
    {
      type: 'lint',
      path: resolve(dirname(require.resolve('eslint')), '../bin/eslint.js'),

      getArgs({fix}) {
        return ['**/*', fix ? '--fix' : undefined];
      },
    },
  ],
  sources: [
    {
      type: 'text',
      path: '.eslintignore',

      async generate(otherSources) {
        return ['**/*.md', ...Object.keys(otherSources)];
      },
    },

    {
      type: 'json',
      path: '.eslintrc.json',

      async generate() {
        return {
          plugins: ['eslint-plugin-import'],
          rules: {
            'import/no-extraneous-dependencies': 'error',
            'import/order': [
              'error',
              {
                'alphabetize': {order: 'asc'},
                'newlines-between': 'never',
                'warnOnUnassignedImports': true,
              },
            ],
            'no-shadow': 'error',
          },
        };
      },
    },
  ],
  dependencies: [
    {
      type: 'json',
      path: '.vscode/extensions.json',

      async generate(input) {
        return deepmerge(input, {recommendations: ['dbaeumer.vscode-eslint']});
      },
    },
  ],
});
