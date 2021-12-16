import {dirname, resolve} from 'path';
import type {Plugin} from 'onecmd';
import {ObjectFile} from '../files/object-file';
import {StringArrayFile} from '../files/string-array-file';
import {isObject} from '../predicates/is-object';
import {isStringArray} from '../predicates/is-string-array';
import {serializeJson} from '../serializers/serialize-json';
import {serializeLines} from '../serializers/serialize-lines';
import {editorconfig} from './editorconfig';
import {eslint} from './eslint';
import {vscode} from './vscode';

const configFile = new ObjectFile({
  path: `.prettierrc.json`,
  is: isObject,
  serialize: serializeJson,
});

const ignoreFile = new StringArrayFile({
  path: `.prettierignore`,
  is: isStringArray,
  serialize: serializeLines,
});

export const prettier = (): Plugin => ({
  setup: () => [
    configFile.new(() => ({
      bracketSpacing: false,
      printWidth: 80,
      proseWrap: `always`,
      quoteProps: `consistent`,
      singleQuote: true,
      trailingComma: `all`,
    })),

    ignoreFile.new((otherFiles) =>
      Object.entries(otherFiles)
        .filter(([, {pretty}]) => !pretty)
        .map(([path]) => path),
    ),

    editorconfig.configFile.append(() => [
      `[*.{html,js,json,md,ts,tsx,yml}]`,
      `charset = unset`,
      `end_of_line = unset`,
      `indent_size = unset`,
      `indent_style = unset`,
      `insert_final_newline = unset`,
      `trim_trailing_whitespace = unset`,
    ]),

    eslint.configFile.merge(() => ({extends: [`prettier`]})),

    vscode.extensionsFile.merge(() => ({
      recommendations: [`esbenp.prettier-vscode`],
    })),

    vscode.settingsFile.merge(() => ({
      'editor.defaultFormatter': `esbenp.prettier-vscode`,
      'editor.formatOnSave': true,
    })),
  ],

  format: ({check}) => [
    {
      command: resolve(dirname(require.resolve(`prettier`)), `bin-prettier.js`),

      args: [
        check ? `--list-different` : `--write`,
        `**/*.{html,js,json,md,ts,tsx,yml}`,
      ],
    },
  ],
});

prettier.configFile = configFile;
prettier.ignoreFile = ignoreFile;
