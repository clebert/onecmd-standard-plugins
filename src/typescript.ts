/* eslint-disable @typescript-eslint/require-await */

import {dirname, resolve} from 'path';
import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';

export const typescript = (
  arch: 'node' | 'preact' | 'react' | 'web',
  dist: 'bundle' | 'package'
): Plugin => ({
  commands: [
    dist === 'package'
      ? {
          type: 'compile',
          path: resolve(dirname(require.resolve('typescript')), '../bin/tsc'),

          getArgs({watch}) {
            return [
              '--project',
              'tsconfig.cjs.json',
              '--incremental',
              '--pretty',
              watch ? '--watch' : undefined,
            ];
          },
        }
      : undefined,

    dist === 'package'
      ? {
          type: 'compile',
          path: resolve(dirname(require.resolve('typescript')), '../bin/tsc'),

          getArgs({watch}) {
            return [
              '--project',
              'tsconfig.esm.json',
              '--incremental',
              '--pretty',
              watch ? '--watch' : undefined,
            ];
          },
        }
      : undefined,
  ],
  sources: [
    {
      type: 'json',
      path: 'tsconfig.json',
      generate: async () => ({
        compilerOptions: {
          // Type Checking
          allowUnreachableCode: false,
          allowUnusedLabels: false,
          // exactOptionalPropertyTypes: true,
          noFallthroughCasesInSwitch: true,
          noImplicitOverride: true,
          noImplicitReturns: true,
          // noPropertyAccessFromIndexSignature: true,
          noUncheckedIndexedAccess: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          strict: true,

          // Modules
          module: 'ESNext',
          moduleResolution: 'Node',
          rootDir: 'src',

          // Emit
          declaration: dist === 'package',
          sourceMap: dist === 'bundle',

          // Interop Constraints
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
          isolatedModules: true,

          // Language and Environment
          jsx:
            arch === 'preact'
              ? 'react-jsx'
              : arch === 'react'
              ? arch
              : undefined,

          jsxImportSource: arch === 'preact' ? arch : undefined,
          lib: arch === 'node' ? ['ES2017'] : ['DOM', 'ES2017'],
          target: 'ES2017',
        },
        include: ['src/**/*.ts', 'src/**/*.tsx', '*.js'],
      }),
    },

    dist === 'package' ? {type: 'artifact', path: 'lib'} : undefined,

    dist === 'package'
      ? {
          type: 'json',
          path: 'tsconfig.cjs.json',

          generate: async () => ({
            compilerOptions: {module: 'CommonJS', outDir: 'lib/cjs'},
            extends: './tsconfig.json',
          }),
        }
      : undefined,

    dist === 'package'
      ? {
          type: 'json',
          path: 'tsconfig.esm.json',

          generate: async () => ({
            compilerOptions: {outDir: 'lib/esm'},
            extends: './tsconfig.json',
          }),
        }
      : undefined,
  ],
  dependencies: [
    {
      type: 'json',
      path: '.vscode/settings.json',

      async generate(input) {
        return deepmerge(input, {
          'typescript.tsdk': 'node_modules/typescript/lib',
        });
      },
    },

    {
      type: 'json',
      path: '.eslintrc.json',

      async generate(input) {
        return deepmerge(
          deepmerge(input, {
            parser: '@typescript-eslint/parser',
            parserOptions: {project: 'tsconfig.json'},
            plugins: ['@typescript-eslint'],
          }),
          {
            rules: {
              '@typescript-eslint/await-thenable': 'error',
              '@typescript-eslint/no-floating-promises': 'error',
              '@typescript-eslint/no-shadow': ['error', {hoist: 'all'}],
              '@typescript-eslint/promise-function-async': 'error',
              '@typescript-eslint/require-await': 'error',
            },
          },
          {arrayMerge: (_, source) => source}
        );
      },
    },

    {
      type: 'json',
      path: '.babelrc.json',

      async generate(input) {
        return deepmerge(input, {presets: ['@babel/typescript']});
      },
    },
  ],
});
