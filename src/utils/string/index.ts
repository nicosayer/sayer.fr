import { deburr } from "lodash";

export const sanitize = (string: string) => {
  return deburr(string)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
};
