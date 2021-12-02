import type {Plugin} from 'onecmd';
import {StringArrayFile} from '../files/string-array-file';
import {isStringArray} from '../predicates/is-string-array';
import {serializeLines} from '../serializers/serialize-lines';

const ignoreFile = new StringArrayFile({
  path: `.gitignore`,
  attrs: {versioned: true, visible: true},
  is: isStringArray,
  serialize: serializeLines,
});

export const git = (): Plugin => ({
  setup: () => [
    ignoreFile.new((otherFiles) => [
      `# This file is generated by @onecmd/standard-plugins.`,
      ...Object.entries(otherFiles)
        .filter(([, {versioned}]) => !versioned)
        .map(([path]) => path),
    ]),
  ],
});

git.ignoreFile = ignoreFile;
