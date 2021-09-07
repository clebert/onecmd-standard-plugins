import type {Plugin} from 'onecmd';
import {serializeJson} from './util/serialize-json';

export interface VscodePluginOptions {
  readonly showFilesInEditor?: boolean;
}

export const vscode = ({
  showFilesInEditor,
}: VscodePluginOptions = {}): Plugin => ({
  sources: [
    {type: 'unknown', path: '.vscode'},
    {
      type: 'object',
      path: '.vscode/extensions.json',
      generate: () => ({recommendations: []}),
      serialize: serializeJson,
    },
    {
      type: 'object',
      path: '.vscode/settings.json',

      generate: (otherSources) => ({
        'files.exclude': Object.entries(otherSources).reduce(
          (exclude, [path, {versioned}]) => ({
            ...exclude,
            [path]: !showFilesInEditor && !versioned,
          }),
          {'**/.DS_Store': true, '**/.git': true} as Record<string, boolean>
        ),
      }),

      serialize: serializeJson,
    },
  ],
});
