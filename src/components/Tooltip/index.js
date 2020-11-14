import { Tooltip as BPTooltip } from "@blueprintjs/core";
import { useDevice } from "providers/DeviceProvider";
import React from "react";

export const Tooltip = ({ children = null, ...rest }) => {
  const { isMobileSize } = useDevice();

  if (isMobileSize) {
    return children;
  }

  return <BPTooltip children={children} {...rest} />;
};
