export const isString = (val: unknown) => typeof val === 'string';

export const isFunction = (val: unknown) => typeof val === 'function';
export const isObject = (val: unknown) => typeof val === 'object';

export function isHttpUrl(url?: string): boolean {
  if (!url) {
    return false;
  }
  const httpRegex = /^https?:\/\/.*$/;
  return httpRegex.test(url);
}
