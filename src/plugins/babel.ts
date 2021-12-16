import type {Plugin} from 'onecmd';
import {ObjectFile} from '../files/object-file';
import {isObject} from '../predicates/is-object';
import {serializeJson} from '../serializers/serialize-json';

const configFile = new ObjectFile({
  path: `.babelrc.json`,
  is: isObject,
  serialize: serializeJson,
});

export const babel = (): Plugin => ({
  setup: () => [configFile.new(() => ({}))],
});

babel.configFile = configFile;
