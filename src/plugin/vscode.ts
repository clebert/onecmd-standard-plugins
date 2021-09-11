import type {ManagedSource, Plugin} from 'onecmd';
import {isObject} from '../predicate/is-object';
import {serializeJson} from '../serializer/serialize-json';

export interface VscodePluginOptions {
  readonly showFilesInEditor?: boolean;
}

export const vscode = ({
  showFilesInEditor = false,
}: VscodePluginOptions = {}): Plugin => ({
  sources: [
    {type: 'unmanaged', path: '.vscode'},

    {
      type: 'managed',
      path: '.vscode/extensions.json',
      is: isObject,
      create: () => ({recommendations: []}),
      serialize: serializeJson,
    } as ManagedSource<object>,

    {
      type: 'managed',
      path: '.vscode/settings.json',
      is: isObject,

      create: (otherSources) => ({
        'files.exclude': Object.entries(otherSources).reduce(
          (exclude, [path, {editable, versionable}]) => ({
            ...exclude,
            [path]: !showFilesInEditor && !editable && !versionable,
          }),
          {'**/.DS_Store': true, '**/.git': true} as Record<string, boolean>
        ),
      }),

      serialize: serializeJson,
    } as ManagedSource<object>,
  ],
});
