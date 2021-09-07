import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';

export const react = (): Plugin => ({
  dependencies: [
    {
      type: 'object',
      path: '.babelrc.json',
      generate: (input) => deepmerge(input, {presets: ['@babel/react']}),
    },
    {
      type: 'object',
      path: 'tsconfig.json',
      generate: (input) => deepmerge(input, {compilerOptions: {jsx: 'react'}}),
    },
  ],
});
