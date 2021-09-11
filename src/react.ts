import deepmerge from 'deepmerge';
import type {ManagedDependency, Plugin} from 'onecmd';
import {isObject} from './util/is-object';

export const react = (): Plugin => ({
  dependencies: [
    {
      type: 'managed',
      path: '.babelrc.json',
      is: isObject,
      update: (content) => deepmerge(content, {presets: ['@babel/react']}),
    } as ManagedDependency<object>,

    {
      type: 'managed',
      path: 'tsconfig.json',
      is: isObject,

      update: (content) =>
        deepmerge(content, {compilerOptions: {jsx: 'react'}}),
    } as ManagedDependency<object>,
  ],
});
