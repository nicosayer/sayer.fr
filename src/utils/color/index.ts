import { DEFAULT_THEME } from "@mantine/core";
import { sumBy } from "lodash";

export const getColorFromString = (string: string) => {
  const colors = Object.keys(DEFAULT_THEME.colors);

  return colors[
    sumBy(string.split(""), (char) => char.charCodeAt(0)) % colors.length
  ];
};
