import { flow, deburr, toLower } from "lodash/fp";

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
