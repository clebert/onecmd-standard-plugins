import type {Plugin} from 'onecmd';
import {serializeJson} from './util/serialize-json';

export const babel = (): Plugin => ({
  sources: [
    {
      type: 'object',
      path: '.babelrc.json',
      generate: () => ({}),
      serialize: serializeJson,
    },
  ],
});
