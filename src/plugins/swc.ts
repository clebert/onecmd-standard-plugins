import type {Plugin} from 'onecmd';
import {isObject} from '../predicates/is-object';

export const swc = (): Plugin => ({
  setup: () => [
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
