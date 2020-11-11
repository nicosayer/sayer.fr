import { Tooltip as BPTooltip } from "@blueprintjs/core";
import { useWindowSize } from "providers/WindowSizeProvider";
import React from "react";

export const Tooltip = ({ children = null, ...rest }) => {
  const { isOnMobile } = useWindowSize();

  if (isOnMobile) {
    return children;
  }

  return <BPTooltip children={children} {...rest} />;
};
