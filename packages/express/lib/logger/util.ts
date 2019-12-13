export const isUndefined = (obj: any): obj is undefined =>
    typeof obj === 'undefined';
export const isObject = (fn: any): fn is object =>
    !isNil(fn) && typeof fn === 'object';
export const isNil = (obj: any): obj is null | undefined =>
    isUndefined(obj) || obj === null;
