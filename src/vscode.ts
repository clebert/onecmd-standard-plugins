/* eslint-disable @typescript-eslint/require-await */

import type {Plugin} from 'onecmd';

export interface VscodePluginOptions {
  readonly showFilesInEditor?: boolean;
}

export const vscode = ({
  showFilesInEditor,
}: VscodePluginOptions = {}): Plugin => ({
  sources: [
    {type: 'artifact', path: '.vscode'},

    {
      type: 'json',
      path: '.vscode/extensions.json',

      async generate() {
        return {recommendations: []};
      },
    },

    {
      type: 'json',
      path: '.vscode/settings.json',

      async generate(otherSources) {
        const exclude: Record<string, boolean> = {
          '**/.DS_Store': true,
          '**/.git': true,
        };

        for (const [path, {versioned}] of Object.entries(otherSources)) {
          exclude[path] = !showFilesInEditor && !versioned;
        }

        return {'files.exclude': exclude};
      },
    },
  ],
});
