import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';
import {isObject} from '../predicates/is-object';

export const react = (): Plugin => ({
  setup: () => [
    {
      type: 'mod',
      path: '.babelrc.json',
      is: isObject,
      update: (content) => deepmerge(content, {presets: ['@babel/react']}),
    },

    {
      type: 'mod',
      path: 'tsconfig.json',
      is: isObject,

      update: (content) =>
        deepmerge(content, {compilerOptions: {jsx: 'react'}}),
    },
  ],
});
