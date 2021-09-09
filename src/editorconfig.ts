import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';
import {serializeLines} from './util/serialize-lines';

export const editorconfig = (): Plugin => ({
  sources: [
    {
      type: 'object',
      path: '.editorconfig',

      generate: () => [
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
