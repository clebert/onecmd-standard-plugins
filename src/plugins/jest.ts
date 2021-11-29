import {dirname, resolve} from 'path';
import type {Plugin} from 'onecmd';
import {ObjectFile} from '../files/object-file';
import {isObject} from '../predicates/is-object';
import {serializeJson} from '../serializers/serialize-json';

export interface JestPluginOptions {
  readonly coverage?: boolean;
}

const configFile = new ObjectFile({
  path: 'jest.config.json',
  is: isObject,
  serialize: serializeJson,
});

export const jest = ({coverage = false}: JestPluginOptions = {}): Plugin => ({
  setup: () => [
    configFile.new(() => ({
      coverageThreshold: coverage
        ? {
            global: {
              branches: 100,
              functions: 100,
              lines: 100,
              statements: 100,
            },
          }
        : undefined,

      restoreMocks: true,
      testMatch: ['**/src/**/*.test.{js,jsx,ts,tsx}'],
    })),

    {type: 'ref', path: 'coverage'},
  ],

  test: ({watch}) => [
    {
      command: resolve(dirname(require.resolve('jest')), '../bin/jest.js'),
      args: [
        '--silent',
        coverage ? '--coverage' : undefined,
        watch ? '--watch' : undefined,
      ],
    },
  ],
});

jest.configFile = configFile;
