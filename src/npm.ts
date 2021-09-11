import type {Plugin} from 'onecmd';

export const npm = (): Plugin => ({
  sources: [
    {type: 'unmanaged', path: 'node_modules'},
    {type: 'unmanaged', path: 'package-lock.json', versionable: true},
    {type: 'unmanaged', path: 'package.json', versionable: true},
  ],
});
