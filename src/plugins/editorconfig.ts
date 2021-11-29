import type {Plugin} from 'onecmd';
import {StringArrayFile} from '../files/string-array-file';
import {isStringArray} from '../predicates/is-string-array';
import {serializeLines} from '../serializers/serialize-lines';
import {vscode} from './vscode';

const configFile = new StringArrayFile({
  path: '.editorconfig',
  is: isStringArray,
  serialize: serializeLines,
});

export const editorconfig = (): Plugin => ({
  setup: () => [
    configFile.new((otherFiles) => {
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
    }),

    vscode.extensionsFile.merge(() => ({
      recommendations: ['editorconfig.editorconfig'],
    })),

    vscode.settingsFile.merge(() => ({'editor.formatOnSave': true})),
  ],
});

editorconfig.configFile = configFile;
