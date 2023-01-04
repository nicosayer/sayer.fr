import { deburr } from "lodash";

export const sanitize = (string: string) => {
  return deburr(string)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
};

export const capitalizeFirsts = (string: string) => {
  return string
    .toLowerCase()
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};

export const searchString = (string: string, query: string) => {
  return query.split(" ").every((q) => {
    return sanitize(string).indexOf(sanitize(q)) > -1;
  });
};

export const getEmailLocale = (email: string) => {
  return email.split("@")[0];
};
