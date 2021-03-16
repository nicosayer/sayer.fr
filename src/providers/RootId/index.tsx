import React, { ReactNode, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

export const DEFAULT_ROOT_ID = "ccxdzia5sKyms9CRSMEx";

export interface IRootIdContext {
  rootId: string;
  setRootId: (value: string) => void;
}

const RootIdContext = React.createContext<IRootIdContext>({
  rootId: DEFAULT_ROOT_ID,
  setRootId: () => {},
});

export const useRootId = (): IRootIdContext => useContext(RootIdContext);

export const RootIdProvider = ({ children }: { children: ReactNode }) => {
  const history = useHistory();
  const { relativeId } = useParams<{ relativeId: string }>();

  return (
    <RootIdContext.Provider
      value={{
        rootId: relativeId,
        setRootId: (newRootId) => {
          if (newRootId !== relativeId) {
            history.push(newRootId);
          }
        },
      }}
    >
      {children}
    </RootIdContext.Provider>
  );
};
