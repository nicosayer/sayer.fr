import { AnchorButton, Button as BPButton } from "@blueprintjs/core";
import { ComponentOrChildren } from "components/ComponentOrChildren";
import { Tooltip } from "components/Tooltip";
import { Popover } from "components/Popover";
import React from "react";

export const Button = ({ popoverProps, tooltipProps, ...rest }) => {
  const Element = popoverProps || tooltipProps ? AnchorButton : BPButton;

  return (
    <ComponentOrChildren
      component={Popover}
      componentProps={popoverProps}
      disabled={!popoverProps}
    >
      <ComponentOrChildren
        component={Tooltip}
        componentProps={tooltipProps}
        disabled={!tooltipProps}
      >
        <Element {...rest} />
      </ComponentOrChildren>
    </ComponentOrChildren>
  );
};
