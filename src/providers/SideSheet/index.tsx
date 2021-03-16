import React, { ReactNode, useContext, useState } from "react";

import { Component } from "providers/SideSheet/Component";

export interface ISideSheetContext {
  openSideSheet: (value: string) => void;
}

const SideSheetContext = React.createContext<ISideSheetContext>({
  openSideSheet: () => {},
});

export const useSideSheet = (): ISideSheetContext =>
  useContext(SideSheetContext);

export const SideSheetProvider = ({ children }: { children: ReactNode }) => {
  const [relativeId, setRelativeId] = useState<string>();

  return (
    <SideSheetContext.Provider
      value={{
        openSideSheet: setRelativeId,
      }}
    >
      {children}
      <Component
        relativeId={relativeId}
        isShown={Boolean(relativeId)}
        onCloseComplete={() => setRelativeId(undefined)}
      />
    </SideSheetContext.Provider>
  );
};
