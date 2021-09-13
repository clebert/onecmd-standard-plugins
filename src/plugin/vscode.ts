import type {Plugin} from 'onecmd';
import {isObject} from '../predicate/is-object';
import {serializeJson} from '../serializer/serialize-json';

export interface VscodePluginOptions {
  readonly showFilesInEditor?: boolean;
}

export const vscode = ({
  showFilesInEditor = false,
}: VscodePluginOptions = {}): Plugin => ({
  setup: () => [
    {
      type: 'new',
      path: '.vscode/extensions.json',
      is: isObject,
      create: () => ({recommendations: []}),
      serialize: serializeJson,
    },

    {
      type: 'new',
      path: '.vscode/settings.json',
      is: isObject,

      create: (otherFiles) => ({
        'files.exclude': Object.entries(otherFiles).reduce(
          (exclude, [path, {visible}]) => ({
            ...exclude,
            [path]: !showFilesInEditor && !visible,
          }),
          {'**/.DS_Store': true, '**/.git': true} as Record<string, boolean>
        ),
      }),

      serialize: serializeJson,
    },

    {type: 'ref', path: '.vscode'},
  ],
});
