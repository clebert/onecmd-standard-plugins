export function serializeJson(input: object): string {
  return JSON.stringify(input, null, 2) + '\n';
}
