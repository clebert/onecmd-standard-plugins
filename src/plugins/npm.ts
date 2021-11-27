import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';
import {isObject} from '../predicates/is-object';

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

    {
      type: 'mod',
      path: '.vscode/extensions.json',
      is: isObject,

      update: (content) =>
        deepmerge(content, {recommendations: ['eg2.vscode-npm-script']}),
    },
  ],
});
