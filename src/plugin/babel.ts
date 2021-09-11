import type {ManagedSource, Plugin} from 'onecmd';
import {isObject} from '../predicate/is-object';
import {serializeJson} from '../serializer/serialize-json';

export const babel = (): Plugin => ({
  sources: [
    {
      type: 'managed',
      path: '.babelrc.json',
      is: isObject,
      create: () => ({}),
      serialize: serializeJson,
    } as ManagedSource<object>,
  ],
});
