import { flow, deburr, toLower, sortBy } from "lodash/fp";

export const isUnset = (value: any): boolean => {
  return [null, undefined].includes(value);
};

export const isSet = (value: any): boolean => {
  return !isUnset(value);
};

export const log = (value: any): void => {
  console.log(value);
};

export const sanitize = (string: string): string => {
  return flow(deburr, toLower)(string.replace(/[^a-zA-Z0-9]/g, ""));
};

export const randomId = (): string => {
  return Math.random().toString(36).substring(2);
};

export const uniqueId = (prefix?: string): string => {
  if (prefix) {
    return `${prefix}-${randomId()}${randomId()}`;
  }
  return `${randomId()}${randomId()}`;
};

export const searchInString = (string: string, search: string): boolean => {
  return sanitize(string).search(sanitize(search)) > -1;
};

export const isEmail = (string: string): boolean => {
  return Boolean(string.match(/^.+@.+\..+$/));
};

export const caseInsensitiveSortBy = <
  T extends { [key: string]: string | undefined }
>(
  array: T[],
  strings: string[]
) => {
  return sortBy(
    strings.map((string) => (element: T) => element[string]?.toLowerCase()),
    array
  );
};

export const testEnv = (envVar: string | undefined): boolean => {
  return Boolean(envVar && envVar !== "0");
};
