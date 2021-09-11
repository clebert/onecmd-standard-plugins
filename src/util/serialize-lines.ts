import {serializeText} from './serialize-text';

export function serializeLines(content: readonly string[]): string {
  return serializeText(content.join('\n'));
}
