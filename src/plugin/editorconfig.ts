import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';
import {isObject} from '../predicate/is-object';
import {isStringArray} from '../predicate/is-string-array';
import {serializeLines} from '../serializer/serialize-lines';

export const editorconfig = (): Plugin => ({
  setup: () => [
    {
      type: 'new',
      path: '.editorconfig',
      is: isStringArray,

      create: (otherFiles) => {
        const lines = [
          'root = true',
          '[*]',
          'charset = utf-8',
          'end_of_line = lf',
          'indent_size = 2',
          'indent_style = space',
          'insert_final_newline = true',
          'trim_trailing_whitespace = true',
        ];

        const paths = Object.entries(otherFiles)
          .filter(([, {pretty}]) => !pretty)
          .map(([path]) => path);

        if (paths.length > 0) {
          lines.push(
            `[${paths.join(',')}]`,
            'charset = unset',
            'end_of_line = unset',
            'indent_size = unset',
            'indent_style = unset',
            'insert_final_newline = unset',
            'trim_trailing_whitespace = unset'
          );
        }

        return lines;
      },

      serialize: serializeLines,
    },

    {
      type: 'mod',
      path: '.vscode/extensions.json',
      is: isObject,

      update: (content) =>
        deepmerge(content, {recommendations: ['editorconfig.editorconfig']}),
    },

    {
      type: 'mod',
      path: '.vscode/settings.json',
      is: isObject,
      update: (content) => deepmerge(content, {'editor.formatOnSave': true}),
    },
  ],
});
