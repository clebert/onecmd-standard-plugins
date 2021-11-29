import type {Plugin} from 'onecmd';
import {vscode} from './vscode';

export const npm = (): Plugin => ({
  setup: () => [
    vscode.extensionsFile.merge(() => ({
      recommendations: ['eg2.vscode-npm-script'],
    })),

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
