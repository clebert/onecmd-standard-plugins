import type {ManagedSource, Plugin} from 'onecmd';
import {isObject} from './util/is-object';
import {serializeJson} from './util/serialize-json';

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
