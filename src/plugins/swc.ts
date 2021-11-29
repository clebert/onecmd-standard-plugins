import type {Plugin} from 'onecmd';
import {serializeJson} from '..';
import {isObject} from '../predicates/is-object';

export const swc = (): Plugin => ({
  setup: () => [
    {
      type: 'new',
      path: '.swcrc',
      is: isObject,
      create: () => ({jsc: {externalHelpers: true}, sourceMaps: true}),
      serialize: serializeJson,
    },
    {
      type: 'mod',
      path: 'jest.config.json',
      is: isObject,
      update: (content) => ({
        ...content,
        transform: {'^.+\\.tsx?$': ['@swc/jest']},
      }),
    },
  ],
});
