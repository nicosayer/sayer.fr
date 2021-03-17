import { kebabCase } from "lodash/fp";
import React, { AllHTMLAttributes, CSSProperties, ReactHTML } from "react";

import theme, { cssKeyToThemeKey } from "config/theme";
import { css as emotionCSS, cx } from "utils/emotion";
import { isUnset } from "utils/general";

const getValueFromTheme = (key: string, value?: string) => {
  // @ts-ignore
  return theme[cssKeyToThemeKey[key]]?.[value] ?? value;
};

const jsStyleWithTheme = (style: CSSProperties = {}) => {
  return Object.entries(style).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: getValueFromTheme(key, value),
    };
  }, {});
};

const cssStyleWithTheme = (style: CSSProperties = {}) => {
  return Object.entries(style).reduce((acc, [key, value]) => {
    if (isUnset(value)) {
      return acc;
    }

    return `${acc}${kebabCase(key)}:${getValueFromTheme(key, value)};`;
  }, "");
};

export interface BoxProps extends AllHTMLAttributes<HTMLElement> {
  as?: keyof ReactHTML;
  pseudoClasses?: Record<string, CSSProperties>;
  pseudoElements?: Record<string, CSSProperties>;
  css?: string;
  myRef?: any;
}

export function Box({
  as = "div",
  className,
  style,
  pseudoClasses = {},
  pseudoElements = {},
  css,
  myRef,
  ...rest
}: BoxProps) {
  const Element = as;

  return (
    // @ts-ignore
    <Element
      // @ts-ignore
      ref={myRef}
      className={cx(
        className,
        emotionCSS`
          ${jsStyleWithTheme(style)}
          ${Object.entries(pseudoClasses).map(
            ([key, value]) => `&:${key}{${cssStyleWithTheme(value)}}`
          )}
          ${Object.entries(pseudoElements).map(
            ([key, value]) => `&::${key}{${cssStyleWithTheme(value)}}`
          )}
          ${css}
        `
      )}
      {...rest}
    />
  );
}
