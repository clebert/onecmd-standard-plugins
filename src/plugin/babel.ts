import type {Plugin} from 'onecmd';
import {isObject} from '../predicate/is-object';
import {serializeJson} from '../serializer/serialize-json';

export const babel = (): Plugin => ({
  setup: () => [
    {
      type: 'new',
      path: '.babelrc.json',
      is: isObject,
      create: () => ({}),
      serialize: serializeJson,
    },
  ],
});
