export function isString(content: unknown): content is string {
  return typeof content === `string`;
}
