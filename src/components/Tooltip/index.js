import { Tooltip as BPTooltip } from "@blueprintjs/core";
import { useWindowSize } from "hooks/useWindowSize";
import React from "react";

export const Tooltip = ({ children = null, ...rest }) => {
  const { isOnMobile } = useWindowSize();

  if (isOnMobile || children?.props?.disabled) {
    return children;
  }

  return <BPTooltip children={children} {...rest} />;
};
