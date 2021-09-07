import {dirname, resolve} from 'path';
import type {Plugin} from 'onecmd';
import {serializeJson} from './util/serialize-json';

export interface JestPluginOptions {
  readonly coverage?: boolean;
}

export const jest = ({coverage}: JestPluginOptions = {}): Plugin => ({
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
    coverage ? {type: 'unknown', path: 'coverage'} : undefined,
    {
      type: 'object',
      path: 'jest.config.json',

      generate: () => ({
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
  ],
});
