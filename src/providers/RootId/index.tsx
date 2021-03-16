import React, { ReactNode, useContext, useState } from "react";

export const DEFAULT_ROOT_ID = "bG1N4H1zBcNDwWDiZSuB";

export interface IRootIdContext {
  defaultRootId: string;
  rootId: string;
  setRootId: (value: string) => void;
  resetRootId: () => void;
}

const RootIdContext = React.createContext<IRootIdContext>({
  defaultRootId: DEFAULT_ROOT_ID,
  rootId: DEFAULT_ROOT_ID,
  setRootId: () => {},
  resetRootId: () => {},
});

export const useRootId = (): IRootIdContext => useContext(RootIdContext);

export const RootIdProvider = ({ children }: { children: ReactNode }) => {
  const [rootId, setRootId] = useState<string>(DEFAULT_ROOT_ID);

  return (
    <RootIdContext.Provider
      value={{
        defaultRootId: DEFAULT_ROOT_ID,
        rootId,
        setRootId,
        resetRootId: () => {
          setRootId(DEFAULT_ROOT_ID);
        },
      }}
    >
      {children}
    </RootIdContext.Provider>
  );
};
