export function serializeText(input: string): string {
  return input.endsWith('\n') ? input : input + '\n';
}
