import type {Plugin} from 'onecmd';
import {swc} from './swc';
import {typescript} from './typescript';

export const preact = (): Plugin => ({
  setup: () => [
    typescript.configFile.merge(() => ({
      compilerOptions: {jsx: `react-jsx`, jsxImportSource: `preact`},
    })),

    swc.configFile.merge((_, otherFiles) => {
      return otherFiles[typescript.configFile.init.path]
        ? {jsc: {parser: {tsx: true}}}
        : {};
    }),
  ],
});
