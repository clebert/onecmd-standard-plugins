import type {Plugin} from 'onecmd';
import {ObjectFile} from '../files/object-file';
import {isObject} from '../predicates/is-object';
import {serializeJson} from '../serializers/serialize-json';
import {jest} from './jest';

const configFile = new ObjectFile({
  path: '.swcrc',
  is: isObject,
  serialize: serializeJson,
});

export const swc = (): Plugin => ({
  setup: () => [
    configFile.new(() => ({jsc: {externalHelpers: true}, sourceMaps: true})),

    jest.configFile.merge(() => ({transform: {'^.+\\.tsx?$': ['@swc/jest']}})),
  ],
});

swc.configFile = configFile;
