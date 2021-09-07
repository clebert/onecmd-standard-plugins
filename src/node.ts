/* eslint-disable @typescript-eslint/require-await */

import type {Plugin} from 'onecmd';

export const node = (version: string): Plugin => ({
  sources: [
    {
      type: 'text',
      path: '.node-version',
      versioned: true,
      generate: async () => [version],
    },
  ],
});
