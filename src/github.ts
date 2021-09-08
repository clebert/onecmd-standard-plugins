import type {Plugin} from 'onecmd';
import {serializeYaml} from './util/serialize-yaml';

export interface GithubPluginOptions {
  readonly nodeVersion?: string;
}

export const github = ({nodeVersion}: GithubPluginOptions = {}): Plugin => ({
  sources: [
    {
      type: 'object',
      path: '.github/workflows/ci.yml',
      versioned: true,

      generate: () => ({
        name: 'CI',
        on: {
          push: {branches: ['main']},
          pull_request: {branches: ['main']},
          release: {types: ['published']},
        },
        jobs: {
          ci: {
            'runs-on': 'ubuntu-latest',
            'steps': [
              {name: 'Checkout repository', uses: 'actions/checkout@v2'},
              {
                name: 'Setup Node.js',
                uses: 'actions/setup-node@v2',
                ...(nodeVersion ? {with: {'node-version': nodeVersion}} : {}),
              },
              {name: 'Install dependencies', uses: 'bahmutov/npm-install@v1'},
              {name: 'Run CI checks', run: 'npm run ci'},
              {
                name: 'Publish to npm',
                if: "${{ github.event_name == 'release' }}",
                env: {NPM_AUTH_TOKEN: '${{ secrets.NPM_AUTH_TOKEN }}'},
                run: 'npm config set //registry.npmjs.org/:_authToken $NPM_AUTH_TOKEN\nnpm publish\n',
              },
            ],
          },
        },
      }),

      serialize: serializeYaml,
    },
  ],
});
