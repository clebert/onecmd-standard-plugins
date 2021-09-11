import {dirname, resolve} from 'path';
import deepmerge from 'deepmerge';
import type {ManagedDependency, ManagedSource, Plugin} from 'onecmd';
import {isObject} from './util/is-object';
import {serializeJson} from './util/serialize-json';

const tscPath = resolve(dirname(require.resolve('typescript')), '../bin/tsc');

export const typescript = (
  arch: 'node' | 'web',
  dist: 'bundle' | 'package'
): Plugin => ({
  commands: [
    dist === 'bundle'
      ? {
          type: 'compile',
          path: tscPath,

          getArgs: ({watch}) => [
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
          type: 'compile',
          path: tscPath,

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
          path: tscPath,

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
      type: 'managed',
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
    } as ManagedSource<object>,

    dist === 'package' ? {type: 'unmanaged', path: 'lib'} : undefined,

    dist === 'package'
      ? ({
          type: 'managed',
          path: 'tsconfig.cjs.json',
          is: isObject,

          create: () => ({
            compilerOptions: {module: 'CommonJS', outDir: 'lib/cjs'},
            extends: './tsconfig.json',
          }),

          serialize: serializeJson,
        } as ManagedSource<object>)
      : undefined,

    dist === 'package'
      ? ({
          type: 'managed',
          path: 'tsconfig.esm.json',
          is: isObject,

          create: () => ({
            compilerOptions: {outDir: 'lib/esm'},
            extends: './tsconfig.json',
          }),

          serialize: serializeJson,
        } as ManagedSource<object>)
      : undefined,
  ],
  dependencies: [
    {
      type: 'managed',
      path: '.vscode/settings.json',
      is: isObject,

      update: (content) =>
        deepmerge(content, {'typescript.tsdk': 'node_modules/typescript/lib'}),
    } as ManagedDependency<object>,

    {
      type: 'managed',
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
              '@typescript-eslint/no-floating-promises': 'error',
              '@typescript-eslint/no-shadow': ['error', {hoist: 'all'}],
              '@typescript-eslint/promise-function-async': 'error',
              '@typescript-eslint/require-await': 'error',
            },
          },
          {arrayMerge: (_, source) => source}
        ),
    } as ManagedDependency<object>,

    {
      type: 'managed',
      path: '.babelrc.json',
      is: isObject,

      update: (content) => deepmerge(content, {presets: ['@babel/typescript']}),
    } as ManagedDependency<object>,
  ],
});
