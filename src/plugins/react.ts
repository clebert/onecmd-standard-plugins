import type {Plugin} from 'onecmd';
import {typescript} from './typescript';

export const react = (): Plugin => ({
  setup: () => [
    typescript.configFile.merge(() => ({compilerOptions: {jsx: 'react'}})),
  ],
});
