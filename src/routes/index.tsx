import React from "react";

import { AuthProvider } from "providers/Auth";
import { OneTimeRelativesProvider } from "providers/OneTimeRelatives";
import { RootIdProvider } from "providers/RootId";
import { RouterProvider } from "providers/Router";
import { SideSheetProvider } from "providers/SideSheet";
import { Home } from "routes/Home";

export const App = React.memo<{}>(() => {
  return (
    <OneTimeRelativesProvider>
      <AuthProvider>
        <SideSheetProvider>
          <RouterProvider>
            <RootIdProvider>
              <Home />
            </RootIdProvider>
          </RouterProvider>
        </SideSheetProvider>
      </AuthProvider>
    </OneTimeRelativesProvider>
  );
});
