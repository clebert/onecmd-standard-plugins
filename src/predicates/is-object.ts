export function isObject(content: unknown): content is object {
  return typeof content === 'object' && content !== null;
}
