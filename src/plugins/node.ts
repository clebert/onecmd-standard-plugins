import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';
import {isObject} from '../predicates/is-object';
import {isString} from '../predicates/is-string';
import {serializeText} from '../serializers/serialize-text';

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
