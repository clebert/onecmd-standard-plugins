import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';
import {isObject} from '../predicate/is-object';
import {isString} from '../predicate/is-string';
import {serializeText} from '../serializer/serialize-text';

export const node = (version: string): Plugin => ({
  setup: () => [
    {
      type: 'new',
      path: '.node-version',
      is: isString,
      create: () => version,
      serialize: serializeText,
    },

    {
      type: 'mod',
      path: '.babelrc.json',
      is: isObject,

      update: (content) =>
        deepmerge(content, {
          presets: [['@babel/env', {targets: {node: version}}]],
        }),
    },
  ],
});
