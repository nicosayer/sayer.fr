import CryptoProvider from "providers/Crypto";
import FullPageLoadingProvider from "providers/FullPageLoading";
import MantineProvider from "providers/Mantine";
import OpenFirestoreProvider from "providers/OpenFirestore";
import SecureLoginProvider from "providers/SecureLogin";
import { Suspense } from "react";
import Routes from "routes";

const App = () => {
  return (
    <Suspense fallback={null}>
      <OpenFirestoreProvider />
      <FullPageLoadingProvider>
        <MantineProvider>
          <SecureLoginProvider>
            <CryptoProvider>
              <Routes />
            </CryptoProvider>
          </SecureLoginProvider>
        </MantineProvider>
      </FullPageLoadingProvider>
    </Suspense>
  );
};

export default App;
