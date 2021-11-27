import {dirname, resolve} from 'path';
import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';
import {isObject} from '../predicates/is-object';
import {isStringArray} from '../predicates/is-string-array';
import {serializeJson} from '../serializers/serialize-json';
import {serializeLines} from '../serializers/serialize-lines';

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
          'complexity': 'error',
          'eqeqeq': ['error', 'always', {null: 'ignore'}],
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
          'sort-imports': [
            'error',
            {ignoreDeclarationSort: true, ignoreMemberSort: false},
          ],
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

    {
      type: 'mod',
      path: '.vscode/settings.json',
      is: isObject,
      update: (content) =>
        deepmerge(content, {
          'editor.codeActionsOnSave': {'source.fixAll.eslint': true},
        }),
    },
  ],

  lint: ({fix}) => [
    {
      command: resolve(dirname(require.resolve('eslint')), '../bin/eslint.js'),
      args: ['**/*.{js,jsx,ts,tsx}', fix ? '--fix' : undefined],
    },
  ],
});
