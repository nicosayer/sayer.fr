export const isUnset = (value: any): value is null | undefined => {
  return [null, undefined].includes(value);
};

export const isSet = <T>(value: T): value is Exclude<T, null | undefined> => {
  return !isUnset(value);
};

export const cleanArray = <T>(value: (T | undefined | null | false)[]): T[] => {
  return value.filter(Boolean) as T[];
};
