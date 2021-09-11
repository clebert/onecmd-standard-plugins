import {dirname, resolve} from 'path';
import deepmerge from 'deepmerge';
import type {ManagedDependency, ManagedSource, Plugin} from 'onecmd';
import {isObject} from '../predicate/is-object';
import {isStringArray} from '../predicate/is-string-array';
import {serializeJson} from '../serializer/serialize-json';
import {serializeLines} from '../serializer/serialize-lines';

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
      type: 'managed',
      path: '.prettierignore',
      is: isStringArray,
      create: (otherSources) => Object.keys(otherSources),
      serialize: serializeLines,
    } as ManagedSource<readonly string[]>,

    {
      type: 'managed',
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
    } as ManagedSource<object>,
  ],
  dependencies: [
    {
      type: 'managed',
      path: '.vscode/extensions.json',
      is: isObject,

      update: (content) =>
        deepmerge(content, {recommendations: ['esbenp.prettier-vscode']}),
    } as ManagedDependency<object>,

    {
      type: 'managed',
      path: '.vscode/settings.json',
      is: isObject,
      update: (content) => deepmerge(content, {'editor.formatOnSave': true}),
    } as ManagedDependency<object>,

    {
      type: 'managed',
      path: '.eslintrc.json',
      is: isObject,
      update: (content) => deepmerge(content, {extends: ['prettier']}),
    } as ManagedDependency<object>,

    {
      type: 'managed',
      path: '.editorconfig',
      is: isStringArray,

      update: (content) => [
        ...(content as string[]),
        '[*.{html,js,json,md,ts,tsx,yml}]',
        'insert_final_newline = false',
        'trim_trailing_whitespace = false',
      ],
    } as ManagedDependency<readonly string[]>,
  ],
});
