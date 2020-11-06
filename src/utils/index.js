import { flow, deburr, toLower, sortBy } from "lodash/fp";

export const isUnset = (value) => {
  return [null, undefined].includes(value);
};

export const isSet = (value) => {
  return !isUnset(value);
};

export const logError = (error) => {
  console.log(`Error: ${error}`);
};

export const sanitize = (string) => {
  return flow(deburr, toLower)(string.replace(/[^a-zA-Z0-9]/g, ""));
};

export const uniqueId = () => {
  return Math.random().toString(36).substring(2);
};

export const searchInString = (string, search) => {
  return sanitize(string).search(sanitize(search)) > -1;
};

export const isEmail = (string) => {
  return string.match(/^.+@.+\..+$/);
};

export const caseInsensitiveSortBy = (array, string) => {
  return sortBy((element) => element[string]?.toLowerCase(), array);
};
