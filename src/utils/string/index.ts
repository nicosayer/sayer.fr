import { deburr, last } from "lodash";

export const sanitize = (string: string) => {
  return deburr(string)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
};

export const formatPassword = (password: string) => {
  return `${password[0]}••••••••${last(password)}`;
};
