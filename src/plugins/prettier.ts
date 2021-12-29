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

interface Language {
  readonly extension: string;
  readonly identifier: string;
}

const languages: readonly Language[] = [
  {identifier: `css`, extension: `css`},
  {identifier: `html`, extension: `html`},
  {identifier: `javascript`, extension: `js`},
  {identifier: `javascriptreact`, extension: `jsx`},
  {identifier: `json`, extension: `json`},
  {identifier: `svelte`, extension: `svelte`},
  {identifier: `typescript`, extension: `ts`},
  {identifier: `typescriptreact`, extension: `tsx`},
  {identifier: `yaml`, extension: `yml`},
];

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
      `[*.{${languages.map(({extension}) => extension).join(`,`)}}]`,
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
      ...languages.reduce<Record<string, object>>((settings, {identifier}) => {
        settings[`[${identifier}]`] = {
          'editor.defaultFormatter': `esbenp.prettier-vscode`,
        };

        return settings;
      }, {}),
      'editor.formatOnSave': true,
    })),
  ],

  format: ({check}) => [
    {
      command: resolve(dirname(require.resolve(`prettier`)), `bin-prettier.js`),

      args: [
        check ? `--check` : `--write`,
        `**/*.{${languages.map(({extension}) => extension).join(`,`)}}`,
      ],
    },
  ],
});

prettier.configFile = configFile;
prettier.ignoreFile = ignoreFile;
