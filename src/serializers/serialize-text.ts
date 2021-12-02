export function serializeText(content: string): string {
  return content.endsWith(`\n`) ? content : content + `\n`;
}
