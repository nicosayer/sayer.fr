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
