import {dirname, resolve} from 'path';
import type {Plugin} from 'onecmd';
import {ObjectFile} from '../files/object-file';
import {isObject} from '../predicates/is-object';
import {serializeJson} from '../serializers/serialize-json';
import {eslint} from './eslint';
import {swc} from './swc';
import {vscode} from './vscode';

const command = resolve(dirname(require.resolve('typescript')), '../bin/tsc');
const target = 'es2019';

const configFile = new ObjectFile({
  path: 'tsconfig.json',
  is: isObject,
  serialize: serializeJson,
});

const cjsConfigFile = new ObjectFile({
  path: 'tsconfig.cjs.json',
  is: isObject,
  serialize: serializeJson,
});

const esmConfigFile = new ObjectFile({
  path: 'tsconfig.esm.json',
  is: isObject,
  serialize: serializeJson,
});

export const typescript = (
  arch: 'node' | 'web',
  dist: 'bundle' | 'package'
): Plugin => ({
  setup: () => [
    configFile.new(() => ({
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
        lib: arch === 'node' ? [target] : ['dom', target],
        target: target,
      },
      include: ['src/**/*.ts', 'src/**/*.tsx', '*.js'],
    })),

    dist === 'package'
      ? cjsConfigFile.new(() => ({
          compilerOptions: {module: 'commonjs', outDir: 'lib/cjs'},
          extends: './tsconfig.json',
        }))
      : undefined,

    dist === 'package'
      ? esmConfigFile.new(() => ({
          compilerOptions: {outDir: 'lib/esm'},
          extends: './tsconfig.json',
        }))
      : undefined,

    eslint.configFile.merge(() => ({
      parser: '@typescript-eslint/parser',
      parserOptions: {project: 'tsconfig.json'},
      plugins: ['@typescript-eslint'],
    })),

    eslint.configFile.merge(
      () => ({
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
      }),
      {deep: true, replaceArrays: true}
    ),

    vscode.settingsFile.merge(() => ({
      'typescript.tsdk': 'node_modules/typescript/lib',
    })),

    swc.configFile.merge(() => ({
      jsc: {parser: {syntax: 'typescript', tsx: true}, target},
    })),

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

typescript.configFile = configFile;
