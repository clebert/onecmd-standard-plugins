import deepmerge from 'deepmerge';
import type {ManagedDependency, ManagedSource, Plugin} from 'onecmd';
import {isObject} from '../predicate/is-object';
import {isStringArray} from '../predicate/is-string-array';
import {serializeLines} from '../serializer/serialize-lines';

export const editorconfig = (): Plugin => ({
  sources: [
    {
      type: 'managed',
      path: '.editorconfig',
      is: isStringArray,

      create: () => [
        'root = true',
        '[*]',
        'charset = utf-8',
        'end_of_line = lf',
        'indent_size = 2',
        'indent_style = space',
        'insert_final_newline = true',
        'trim_trailing_whitespace = true',
      ],

      serialize: serializeLines,
    } as ManagedSource<readonly string[]>,
  ],
  dependencies: [
    {
      type: 'managed',
      path: '.vscode/extensions.json',
      is: isObject,

      update: (content) =>
        deepmerge(content, {recommendations: ['editorconfig.editorconfig']}),
    } as ManagedDependency<object>,

    {
      type: 'managed',
      path: '.vscode/settings.json',
      is: isObject,
      update: (content) => deepmerge(content, {'editor.formatOnSave': true}),
    } as ManagedDependency<object>,
  ],
});
