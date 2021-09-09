import {dirname, resolve} from 'path';
import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';
import {serializeJson} from './util/serialize-json';
import {serializeLines} from './util/serialize-lines';

export const eslint = (): Plugin => ({
  commands: [
    {
      type: 'lint',
      path: resolve(dirname(require.resolve('eslint')), '../bin/eslint.js'),
      getArgs: ({fix}) => ['**/*.{js,jsx,ts,tsx}', fix ? '--fix' : undefined],
    },
  ],
  sources: [
    {
      type: 'object',
      path: '.eslintignore',
      generate: (otherSources) => Object.keys(otherSources),
      serialize: serializeLines,
    },
    {
      type: 'object',
      path: '.eslintrc.json',

      generate: () => ({
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
  ],
  dependencies: [
    {
      type: 'object',
      path: '.vscode/extensions.json',

      generate: (input) =>
        deepmerge(input, {recommendations: ['dbaeumer.vscode-eslint']}),
    },
  ],
});
