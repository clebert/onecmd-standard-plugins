/* eslint-disable @typescript-eslint/require-await */

import type {Plugin} from 'onecmd';

export const babel = (): Plugin => ({
  sources: [
    {
      type: 'json',
      path: '.babelrc.json',
      generate: async () => ({
        presets: [['@babel/env', {targets: {node: 'current'}}]],
      }),
    },
  ],
});
