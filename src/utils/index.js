import { flow, deburr, toLower, sortBy } from "lodash/fp";

export const isUnset = (value) => {
  return [null, undefined].includes(value);
};

export const isSet = (value) => {
  return !isUnset(value);
};

export const logError = (error, info = {}) => {
  console.log(`Error: ${error}\nInfo: ${JSON.stringify(info)}`);
};

export const sanitize = (string) => {
  return flow(deburr, toLower)(string.replace(/[^a-zA-Z0-9]/g, ""));
};

export const randomId = () => {
  return Math.random().toString(36).substring(2);
};

export const uniqueId = (prefix = "") => {
  if (prefix) {
    return `${prefix}-${randomId()}${randomId()}`;
  }
  return `${randomId()}${randomId()}`;
};

export const searchInString = (string, search) => {
  return sanitize(string).search(sanitize(search)) > -1;
};

export const isEmail = (string) => {
  return string.match(/^.+@.+\..+$/);
};

export const caseInsensitiveSortBy = (array, strings) => {
  return sortBy(
    strings.map((string) => (element) => element[string]?.toLowerCase()),
    array
  );
};

export const formatFirestoreDate = (date) => {
  return new Date(date.seconds * 1000);
};
