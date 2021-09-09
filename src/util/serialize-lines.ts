import {serializeText} from './serialize-text';

export function serializeLines(input: object): string {
  return serializeText((input as string[]).join('\n'));
}
