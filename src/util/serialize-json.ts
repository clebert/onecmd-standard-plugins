export function serializeJson(content: object): string {
  return JSON.stringify(content, null, 2) + '\n';
}
