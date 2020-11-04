import { Tooltip as BPTooltip } from "@blueprintjs/core";
import { useIsMobile } from "hooks/useIsMobile";
import React from "react";

export const Tooltip = ({ children = null, ...rest }) => {
  const isMobile = useIsMobile();

  if (isMobile || children?.props?.disabled) {
    return children;
  }

  return <BPTooltip children={children} {...rest} />;
};
