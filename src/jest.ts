/* eslint-disable @typescript-eslint/require-await */

import {dirname, resolve} from 'path';
import type {Plugin} from 'onecmd';

export interface JestPluginOptions {
  readonly coverage?: boolean;
}

export const jest = ({coverage}: JestPluginOptions = {}): Plugin => ({
  commands: [
    {
      type: 'test',
      path: resolve(dirname(require.resolve('jest')), '../bin/jest.js'),

      getArgs({watch}) {
        return [
          '--silent',
          coverage ? '--coverage' : undefined,
          watch ? '--watch' : undefined,
        ];
      },
    },
  ],
  sources: [
    coverage ? {type: 'artifact', path: 'coverage'} : undefined,

    {
      type: 'json',
      path: 'jest.config.json',

      generate: async () => ({
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
        testMatch: ['**/src/**/*.test.{js,jsx,ts,tsx}'],
      }),
    },
  ],
});
