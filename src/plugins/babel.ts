import type {Plugin} from 'onecmd';
import {isObject} from '../predicates/is-object';
import {serializeJson} from '../serializers/serialize-json';

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
