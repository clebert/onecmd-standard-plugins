import {dirname, resolve} from 'path';
import type {Plugin} from 'onecmd';
import {ObjectFile} from '../files/object-file';
import {StringArrayFile} from '../files/string-array-file';
import {isObject} from '../predicates/is-object';
import {isStringArray} from '../predicates/is-string-array';
import {serializeJson} from '../serializers/serialize-json';
import {serializeLines} from '../serializers/serialize-lines';
import {vscode} from './vscode';

const configFile = new ObjectFile({
  path: `.eslintrc.json`,
  is: isObject,
  serialize: serializeJson,
});

const ignoreFile = new StringArrayFile({
  path: `.eslintignore`,
  is: isStringArray,
  serialize: serializeLines,
});

export const eslint = (): Plugin => ({
  setup: () => [
    configFile.new(() => ({
      plugins: [`eslint-plugin-import`],
      rules: {
        'complexity': `error`,
        'eqeqeq': [`error`, `always`, {null: `ignore`}],
        'import/no-extraneous-dependencies': `error`,
        'import/order': [
          `error`,
          {
            'alphabetize': {order: `asc`},
            'newlines-between': `never`,
            'warnOnUnassignedImports': true,
          },
        ],
        'no-shadow': `error`,
        'object-shorthand': `error`,
        'prefer-const': `error`,
        'quotes': [`error`, `backtick`],
        'sort-imports': [
          `error`,
          {ignoreDeclarationSort: true, ignoreMemberSort: false},
        ],
      },
    })),

    ignoreFile.new((otherFiles) => Object.keys(otherFiles)),

    vscode.extensionsFile.merge(() => ({
      recommendations: [`dbaeumer.vscode-eslint`],
    })),

    vscode.settingsFile.merge(() => ({
      'editor.codeActionsOnSave': {'source.fixAll.eslint': true},
    })),
  ],

  lint: ({fix}) => [
    {
      command: resolve(dirname(require.resolve(`eslint`)), `../bin/eslint.js`),
      args: [`**/*.{js,jsx,ts,tsx}`, fix ? `--fix` : undefined],
    },
  ],
});

eslint.configFile = configFile;
eslint.ignoreFile = ignoreFile;
