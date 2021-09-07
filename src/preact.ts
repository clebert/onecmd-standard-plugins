import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';

export const preact = (): Plugin => ({
  dependencies: [
    {
      type: 'object',
      path: 'tsconfig.json',

      generate: (input) =>
        deepmerge(input, {
          compilerOptions: {jsx: 'react-jsx', jsxImportSource: 'preact'},
        }),
    },
  ],
});
