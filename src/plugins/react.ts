import type {Plugin} from 'onecmd';
import {babel} from './babel';
import {typescript} from './typescript';

export const react = (): Plugin => ({
  setup: () => [
    babel.configFile.merge(() => ({presets: [`@babel/react`]})),
    typescript.configFile.merge(() => ({compilerOptions: {jsx: `react`}})),
  ],
});
