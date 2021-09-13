import type {Plugin} from 'onecmd';

export const npm = (): Plugin => ({
  setup: () => [
    {type: 'ref', path: 'node_modules'},

    {
      type: 'ref',
      path: 'package-lock.json',
      attrs: {versioned: true, visible: true},
    },

    {
      type: 'ref',
      path: 'package.json',
      attrs: {versioned: true, visible: true},
    },
  ],
});
