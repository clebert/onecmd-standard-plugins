import {dirname, resolve} from 'path';
import deepmerge from 'deepmerge';
import type {ManagedDependency, ManagedSource, Plugin} from 'onecmd';
import {isObject} from '../predicate/is-object';
import {isStringArray} from '../predicate/is-string-array';
import {serializeJson} from '../serializer/serialize-json';
import {serializeLines} from '../serializer/serialize-lines';

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
      type: 'managed',
      path: '.eslintignore',
      is: isStringArray,
      create: (otherSources) => Object.keys(otherSources),
      serialize: serializeLines,
    } as ManagedSource<readonly string[]>,

    {
      type: 'managed',
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
    } as ManagedSource<object>,
  ],
  dependencies: [
    {
      type: 'managed',
      path: '.vscode/extensions.json',
      is: isObject,

      update: (content) =>
        deepmerge(content, {recommendations: ['dbaeumer.vscode-eslint']}),
    } as ManagedDependency<object>,
  ],
});
