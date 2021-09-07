import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';
import {serializeText} from './util/serialize-text';

export const node = (version: string): Plugin => ({
  sources: [
    {
      type: 'string',
      path: '.node-version',
      generate: () => version,
      serialize: serializeText,
    },
  ],
  dependencies: [
    {
      type: 'object',
      path: '.babelrc.json',

      generate: (input) =>
        deepmerge(input, {
          presets: [['@babel/env', {targets: {node: version}}]],
        }),
    },
  ],
});
