/* eslint-disable @typescript-eslint/require-await */

import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';

export const editorconfig = (): Plugin => ({
  sources: [
    {
      type: 'text',
      path: '.editorconfig',

      async generate() {
        return [
          'root = true',
          '[*]',
          'charset = utf-8',
          'end_of_line = lf',
          'indent_size = 2',
          'indent_style = space',
          'insert_final_newline = true',
          'trim_trailing_whitespace = true',
        ];
      },
    },
  ],
  dependencies: [
    {
      type: 'json',
      path: '.vscode/extensions.json',

      async generate(input) {
        return deepmerge(input, {
          recommendations: ['editorconfig.editorconfig'],
        });
      },
    },
  ],
});
