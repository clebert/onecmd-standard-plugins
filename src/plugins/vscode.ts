import type {Plugin} from 'onecmd';
import {ObjectFile} from '../files/object-file';
import {isObject} from '../predicates/is-object';
import {serializeJson} from '../serializers/serialize-json';

export interface VscodePluginOptions {
  readonly showFilesInEditor?: boolean;
}

const extensionsFile = new ObjectFile({
  path: `.vscode/extensions.json`,
  is: isObject,
  serialize: serializeJson,
});

const settingsFile = new ObjectFile({
  path: `.vscode/settings.json`,
  is: isObject,
  serialize: serializeJson,
});

export const vscode = ({
  showFilesInEditor = false,
}: VscodePluginOptions = {}): Plugin => ({
  setup: () => [
    extensionsFile.new(() => ({recommendations: []})),

    settingsFile.new((otherFiles) => ({
      'files.exclude': Object.entries(otherFiles).reduce(
        (exclude, [path, {visible}]) => ({
          ...exclude,
          [path]: !showFilesInEditor && !visible,
        }),
        {'**/.DS_Store': true, '**/.git': true} as Record<string, boolean>
      ),
    })),

    {type: `ref`, path: `.vscode`},
  ],
});

vscode.extensionsFile = extensionsFile;
vscode.settingsFile = settingsFile;
