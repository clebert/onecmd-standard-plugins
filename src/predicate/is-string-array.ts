import {isString} from './is-string';

export function isStringArray(content: unknown): content is readonly string[] {
  return Array.isArray(content) && content.every(isString);
}
