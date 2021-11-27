import {dirname, resolve} from 'path';
import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';
import {isObject} from '../predicates/is-object';
import {serializeJson} from '../serializers/serialize-json';

const command = resolve(dirname(require.resolve('typescript')), '../bin/tsc');

export const typescript = (
  arch: 'node' | 'web',
  dist: 'bundle' | 'package'
): Plugin => ({
  setup: () => [
    {
      type: 'new',
      path: 'tsconfig.json',
      is: isObject,

      create: () => ({
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
          module: 'esnext',
          moduleResolution: 'node',
          rootDir: 'src',

          // Emit
          declaration: dist === 'package',
          sourceMap: dist === 'bundle',

          // Interop Constraints
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
          isolatedModules: true,

          // Language and Environment
          lib: arch === 'node' ? ['es2019'] : ['dom', 'es2019'],
          target: 'es2019',
        },
        include: ['src/**/*.ts', 'src/**/*.tsx', '*.js'],
      }),

      serialize: serializeJson,
    },

    dist === 'package'
      ? {
          type: 'new',
          path: 'tsconfig.cjs.json',
          is: isObject,

          create: () => ({
            compilerOptions: {module: 'commonjs', outDir: 'lib/cjs'},
            extends: './tsconfig.json',
          }),

          serialize: serializeJson,
        }
      : undefined,

    dist === 'package'
      ? {
          type: 'new',
          path: 'tsconfig.esm.json',
          is: isObject,

          create: () => ({
            compilerOptions: {outDir: 'lib/esm'},
            extends: './tsconfig.json',
          }),

          serialize: serializeJson,
        }
      : undefined,

    {
      type: 'mod',
      path: '.babelrc.json',
      is: isObject,

      update: (content) => deepmerge(content, {presets: ['@babel/typescript']}),
    },

    {
      type: 'mod',
      path: '.eslintrc.json',
      is: isObject,

      update: (content) =>
        deepmerge(
          deepmerge(content, {
            parser: '@typescript-eslint/parser',
            parserOptions: {project: 'tsconfig.json'},
            plugins: ['@typescript-eslint'],
          }),
          {
            rules: {
              '@typescript-eslint/await-thenable': 'error',
              '@typescript-eslint/consistent-type-imports': [
                'error',
                {prefer: 'type-imports'},
              ],
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
      type: 'mod',
      path: '.vscode/settings.json',
      is: isObject,

      update: (content) =>
        deepmerge(content, {'typescript.tsdk': 'node_modules/typescript/lib'}),
    },

    dist === 'package' ? {type: 'ref', path: 'lib'} : undefined,
  ],

  compile: ({watch}) => [
    dist === 'bundle'
      ? {
          command,

          args: [
            '--project',
            'tsconfig.json',
            '--noEmit',
            '--pretty',
            watch ? '--watch' : undefined,
          ],
        }
      : undefined,

    dist === 'package'
      ? {
          command,

          args: [
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
          command,

          args: [
            '--project',
            'tsconfig.esm.json',
            '--incremental',
            '--pretty',
            watch ? '--watch' : undefined,
          ],
        }
      : undefined,
  ],
});
