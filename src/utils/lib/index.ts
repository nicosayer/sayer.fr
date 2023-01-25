const isSet = <T>(value: T): value is Exclude<T, null | undefined> => {
  return value !== undefined && value !== null;
};

export const cleanArray = <T>(value: (T | undefined | null)[]): T[] => {
  return value.filter(isSet) as T[];
};
