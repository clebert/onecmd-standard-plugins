import type {Plugin} from 'onecmd';
import {eslint} from './eslint';
import {typescript} from './typescript';
import {vscode} from './vscode';

export const svelte = (): Plugin => ({
  setup: () => [
    eslint.configFile.merge(() => ({
      plugins: [`svelte3`],
      parserOptions: {extraFileExtensions: [`.svelte`]},
      overrides: [{files: [`*.svelte`], processor: `svelte3/svelte3`}],
      settings: {[`svelte3/typescript`]: true},
    })),

    typescript.configFile.merge(() => ({
      compilerOptions: {preserveValueImports: true},
      include: [`src/**/*.svelte`],
    })),

    vscode.extensionsFile.merge(() => ({
      recommendations: [`svelte.svelte-vscode`],
    })),

    vscode.settingsFile.merge(() => ({'eslint.validate': [`svelte`]})),
  ],
});
