import {dirname, resolve} from 'path';
import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';
import {isObject} from '../predicate/is-object';
import {isStringArray} from '../predicate/is-string-array';
import {serializeJson} from '../serializer/serialize-json';
import {serializeLines} from '../serializer/serialize-lines';

export const eslint = (): Plugin => ({
  setup: () => [
    {
      type: 'new',
      path: '.eslintignore',
      is: isStringArray,
      create: (otherFiles) => Object.keys(otherFiles),
      serialize: serializeLines,
    },

    {
      type: 'new',
      path: '.eslintrc.json',
      is: isObject,

      create: () => ({
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
      }),

      serialize: serializeJson,
    },

    {
      type: 'mod',
      path: '.vscode/extensions.json',
      is: isObject,

      update: (content) =>
        deepmerge(content, {recommendations: ['dbaeumer.vscode-eslint']}),
    },
  ],

  lint: ({fix}) => [
    {
      command: resolve(dirname(require.resolve('eslint')), '../bin/eslint.js'),
      args: ['**/*.{js,jsx,ts,tsx}', fix ? '--fix' : undefined],
    },
  ],
});
