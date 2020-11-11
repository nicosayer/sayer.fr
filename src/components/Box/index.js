import { css as emotionCSS, cx } from "emotion";
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
  className,
  style,
  classes = {},
  css = "",
  ...rest
}) => {
  const Element = as;

  return (
    <Element
      className={cx(
        className,
        emotionCSS`
          ${withTheme(style)}
          ${Object.entries(classes).map(
            ([key, value]) => `&:${key}{${jsToCss(value)}}`
          )}
          ${css}
        `
      )}
      {...rest}
    />
  );
};
