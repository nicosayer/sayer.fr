import React, { ReactNode, useContext } from "react";
import { Helmet } from "react-helmet";
import { useParams, useHistory } from "react-router-dom";

import { useOneTimeRelatives } from "providers/OneTimeRelatives";

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
  const { searchableRelatives } = useOneTimeRelatives();
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
      <Helmet>
        <title>{searchableRelatives[relativeId]}</title>
      </Helmet>
      {children}
    </RootIdContext.Provider>
  );
};
