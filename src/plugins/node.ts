import type {Plugin} from 'onecmd';
import {StringFile} from '../files/string-file';
import {isString} from '../predicates/is-string';
import {serializeText} from '../serializers/serialize-text';
import {babel} from './babel';

const versionFile = new StringFile({
  path: `.node-version`,
  is: isString,
  serialize: serializeText,
});

export const node = (version: string): Plugin => ({
  setup: () => [
    versionFile.new(() => version),

    babel.configFile.merge(() => ({
      presets: [[`@babel/env`, {targets: {node: version}}]],
    })),
  ],
});

node.versionFile = versionFile;
