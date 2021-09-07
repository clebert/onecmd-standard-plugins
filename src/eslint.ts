import {dirname, resolve} from 'path';
import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';
import {serializeJson} from './util/serialize-json';
import {serializeText} from './util/serialize-text';

export const eslint = (): Plugin => ({
  commands: [
    {
      type: 'lint',
      path: resolve(dirname(require.resolve('eslint')), '../bin/eslint.js'),
      getArgs: ({fix}) => ['**/*', fix ? '--fix' : undefined],
    },
  ],
  sources: [
    {
      type: 'string',
      path: '.eslintignore',

      generate: (otherSources) =>
        ['**/*.md', ...Object.keys(otherSources)].join('\n'),

      serialize: serializeText,
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
