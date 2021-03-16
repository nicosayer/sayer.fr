import { Pane, SideSheet, SideSheetProps, Spinner } from "evergreen-ui";
import React, { useEffect, useState } from "react";

import { DocumentData } from "config/firebase";
import { Tabs } from "providers/SideSheet/Component/Tabs";
import { relativeDoc } from "utils/relative";
export const Component = ({
  relativeId,
  ...rest
}: Omit<SideSheetProps, "children"> & { relativeId?: string }) => {
  const [relative, setRelative] = useState<DocumentData>();

  useEffect(() => {
    if (relativeId) {
      relativeDoc(relativeId).onSnapshot(setRelative);
    } else {
      setRelative(undefined);
    }
  }, [relativeId]);

  return (
    <SideSheet {...rest}>
      {relative ? (
        <Tabs relative={relative} />
      ) : (
        <Pane height="100%" background="tint1" padding={16}>
          <Spinner />
        </Pane>
      )}
    </SideSheet>
  );
};
