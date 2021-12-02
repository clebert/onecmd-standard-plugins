import type {Plugin} from 'onecmd';
import {typescript} from './typescript';

export const preact = (): Plugin => ({
  setup: () => [
    typescript.configFile.merge(() => ({
      compilerOptions: {jsx: `react-jsx`, jsxImportSource: `preact`},
    })),
  ],
});
