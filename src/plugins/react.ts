import type {Plugin} from 'onecmd';
import {babel} from './babel';
import {swc} from './swc';
import {typescript} from './typescript';

export const react = (): Plugin => ({
  setup: () => [
    babel.configFile.merge(() => ({presets: [`@babel/react`]})),
    typescript.configFile.merge(() => ({compilerOptions: {jsx: `react`}})),

    swc.configFile.merge((_, otherFiles) => {
      return otherFiles[typescript.configFile.init.path]
        ? {jsc: {parser: {tsx: true}}}
        : {};
    }),
  ],
});
