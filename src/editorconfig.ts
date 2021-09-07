import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';
import {serializeText} from './util/serialize-text';

export const editorconfig = (): Plugin => ({
  sources: [
    {
      type: 'string',
      path: '.editorconfig',

      generate: () =>
        [
          'root = true',
          '[*]',
          'charset = utf-8',
          'end_of_line = lf',
          'indent_size = 2',
          'indent_style = space',
          'insert_final_newline = true',
          'trim_trailing_whitespace = true',
        ].join('\n'),

      serialize: serializeText,
    },
  ],
  dependencies: [
    {
      type: 'object',
      path: '.vscode/extensions.json',

      generate: (input) =>
        deepmerge(input, {
          recommendations: ['editorconfig.editorconfig'],
        }),
    },
  ],
});
