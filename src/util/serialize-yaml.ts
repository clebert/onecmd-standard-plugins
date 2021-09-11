import {dump} from 'js-yaml';

export function serializeYaml(content: object): string {
  return dump(content, {noRefs: true});
}
