import {dirname, resolve} from 'path';
import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';
import {serializeJson} from './util/serialize-json';

export const typescript = (
  arch: 'node' | 'web',
  dist: 'bundle' | 'package'
): Plugin => ({
  commands: [
    dist === 'package'
      ? {
          type: 'compile',
          path: resolve(dirname(require.resolve('typescript')), '../bin/tsc'),

          getArgs: ({watch}) => [
            '--project',
            'tsconfig.cjs.json',
            '--incremental',
            '--pretty',
            watch ? '--watch' : undefined,
          ],
        }
      : undefined,

    dist === 'package'
      ? {
          type: 'compile',
          path: resolve(dirname(require.resolve('typescript')), '../bin/tsc'),

          getArgs: ({watch}) => [
            '--project',
            'tsconfig.esm.json',
            '--incremental',
            '--pretty',
            watch ? '--watch' : undefined,
          ],
        }
      : undefined,
  ],
  sources: [
    {
      type: 'object',
      path: 'tsconfig.json',

      generate: () => ({
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
          lib: arch === 'node' ? ['ES2017'] : ['DOM', 'ES2017'],
          target: 'ES2017',
        },
        include: ['src/**/*.ts', 'src/**/*.tsx', '*.js'],
      }),

      serialize: serializeJson,
    },

    dist === 'package' ? {type: 'unknown', path: 'lib'} : undefined,

    dist === 'package'
      ? {
          type: 'object',
          path: 'tsconfig.cjs.json',

          generate: () => ({
            compilerOptions: {module: 'CommonJS', outDir: 'lib/cjs'},
            extends: './tsconfig.json',
          }),

          serialize: serializeJson,
        }
      : undefined,

    dist === 'package'
      ? {
          type: 'object',
          path: 'tsconfig.esm.json',

          generate: () => ({
            compilerOptions: {outDir: 'lib/esm'},
            extends: './tsconfig.json',
          }),

          serialize: serializeJson,
        }
      : undefined,
  ],
  dependencies: [
    {
      type: 'object',
      path: '.vscode/settings.json',

      generate: (input) =>
        deepmerge(input, {'typescript.tsdk': 'node_modules/typescript/lib'}),
    },
    {
      type: 'object',
      path: '.eslintrc.json',

      generate: (input) =>
        deepmerge(
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
        ),
    },
    {
      type: 'object',
      path: '.babelrc.json',
      generate: (input) => deepmerge(input, {presets: ['@babel/typescript']}),
    },
  ],
});
