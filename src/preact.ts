import deepmerge from 'deepmerge';
import type {ManagedDependency, Plugin} from 'onecmd';
import {isObject} from './util/is-object';

export const preact = (): Plugin => ({
  dependencies: [
    {
      type: 'managed',
      path: 'tsconfig.json',
      is: isObject,

      update: (content) =>
        deepmerge(content, {
          compilerOptions: {jsx: 'react-jsx', jsxImportSource: 'preact'},
        }),
    } as ManagedDependency<object>,
  ],
});
