import type {Plugin} from 'onecmd';
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
  ],
});
