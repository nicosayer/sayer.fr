import { css, cx } from "emotion";
import theme, { cssKeyToThemeKey } from "config/theme";

import { kebabCase } from "lodash/fp";
import { isUnset } from "utils";

const getValueFromTheme = (key, value) => {
  return theme[cssKeyToThemeKey[key]]?.[value] ?? value;
};

const withTheme = (style = {}) => {
  return Object.entries(style).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: getValueFromTheme(key, value),
    }),
    {}
  );
};

const jsToCss = (style = {}) => {
  return Object.entries(style).reduce((acc, [key, value]) => {
    if (isUnset(value)) {
      return acc;
    }
    return `
    ${acc}
    ${kebabCase(key)}:${getValueFromTheme(key, value)};
    `;
  }, "");
};

export const Box = ({
  as = "div",
  style,
  hover,
  focus,
  className,
  ...rest
}) => {
  const Element = as;

  return (
    <Element
      className={cx(
        className,
        css`
          ${withTheme(style)}
          ${hover ? `&:hover{${jsToCss(hover)}}` : ""}
          ${focus ? `&:focus{${jsToCss(focus)}}` : ""}
        `
      )}
      {...rest}
    />
  );
};
