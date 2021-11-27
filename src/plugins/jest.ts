import {dirname, resolve} from 'path';
import type {Plugin} from 'onecmd';
import {isObject} from '../predicates/is-object';
import {serializeJson} from '../serializers/serialize-json';

export interface JestPluginOptions {
  readonly coverage?: boolean;
}

export const jest = ({coverage = false}: JestPluginOptions = {}): Plugin => ({
  setup: () => [
    {
      type: 'new',
      path: 'jest.config.json',
      is: isObject,

      create: () => ({
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
      }),

      serialize: serializeJson,
    },

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
