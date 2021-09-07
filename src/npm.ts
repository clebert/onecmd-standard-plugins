/* eslint-disable @typescript-eslint/require-await */

import type {Plugin} from 'onecmd';

export const npm = (): Plugin => ({
  sources: [
    {type: 'artifact', path: 'node_modules'},
    {type: 'artifact', path: 'package-lock.json', versioned: true},
    {type: 'artifact', path: 'package.json', versioned: true},
  ],
});
