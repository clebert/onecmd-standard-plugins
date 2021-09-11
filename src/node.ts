import deepmerge from 'deepmerge';
import type {ManagedDependency, ManagedSource, Plugin} from 'onecmd';
import {isObject} from './util/is-object';
import {isString} from './util/is-string';
import {serializeText} from './util/serialize-text';

export const node = (version: string): Plugin => ({
  sources: [
    {
      type: 'managed',
      path: '.node-version',
      is: isString,
      create: () => version,
      serialize: serializeText,
    } as ManagedSource<string>,
  ],
  dependencies: [
    {
      type: 'managed',
      path: '.babelrc.json',
      is: isObject,

      update: (content) =>
        deepmerge(content, {
          presets: [['@babel/env', {targets: {node: version}}]],
        }),
    } as ManagedDependency<object>,
  ],
});
