import { deburr } from "lodash";

export const sanitize = (string: string) => {
  return deburr(string)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
};

export const searchString = (string: string, query: string) => {
  return query.split(" ").every((q) => {
    return sanitize(string).indexOf(sanitize(q)) > -1;
  });
};

export const getEmailLocale = (email: string) => {
  return email.split("@")[0];
};

export const cleanString = (string: string) => {
  return string.trim().replace(/ +/g, " ");
};
