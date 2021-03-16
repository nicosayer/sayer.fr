import React from "react";

import { OneTimeRelativesProvider } from "providers/OneTimeRelatives";
import { RootIdProvider } from "providers/RootId";
import { SideSheetProvider } from "providers/SideSheet";
import { Home } from "routes/Home";

export const App = React.memo<{}>(() => {
  return (
    <OneTimeRelativesProvider>
      <RootIdProvider>
        <SideSheetProvider>
          <Home />
        </SideSheetProvider>
      </RootIdProvider>
    </OneTimeRelativesProvider>
  );
});
