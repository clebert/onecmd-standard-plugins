import {dump} from 'js-yaml';

export function serializeYaml(input: object): string {
  return dump(input, {noRefs: true});
}
