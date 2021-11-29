import type {Plugin} from 'onecmd';
import {StringFile} from '../files/string-file';
import {isString} from '../predicates/is-string';
import {serializeText} from '../serializers/serialize-text';

const versionFile = new StringFile({
  path: '.node-version',
  is: isString,
  serialize: serializeText,
});

export const node = (version: string): Plugin => ({
  setup: () => [versionFile.new(() => version)],
});

node.versionFile = versionFile;
