import { Classes, Popover as BPPopover } from "@blueprintjs/core";
import React from "react";

export const Popover = (props) => {
  return (
    <BPPopover popoverClassName={Classes.POPOVER_CONTENT_SIZING} {...props} />
  );
};
