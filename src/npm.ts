import type {Plugin} from 'onecmd';

export const npm = (): Plugin => ({
  sources: [
    {type: 'unknown', path: 'node_modules'},
    {type: 'unknown', path: 'package-lock.json', versionable: true},
    {type: 'unknown', path: 'package.json', versionable: true},
  ],
});
