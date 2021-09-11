import {dirname, resolve} from 'path';
import type {ManagedSource, Plugin} from 'onecmd';
import {isObject} from './util/is-object';
import {serializeJson} from './util/serialize-json';

export interface JestPluginOptions {
  readonly coverage?: boolean;
}

export const jest = ({coverage = false}: JestPluginOptions = {}): Plugin => ({
  commands: [
    {
      type: 'test',
      path: resolve(dirname(require.resolve('jest')), '../bin/jest.js'),

      getArgs: ({watch}) => [
        '--silent',
        coverage ? '--coverage' : undefined,
        watch ? '--watch' : undefined,
      ],
    },
  ],
  sources: [
    coverage ? {type: 'unmanaged', path: 'coverage'} : undefined,

    {
      type: 'managed',
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
    } as ManagedSource<object>,
  ],
});
