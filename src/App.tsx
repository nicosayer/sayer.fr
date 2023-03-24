import FullPageLoadingProvider from "providers/FullPageLoading";
import MantineProvider from "providers/Mantine";
import OpenFirestoreProvider from "providers/OpenFirestore";
import SecureLoginProvider from "providers/SecureLogin";
import Routes from "routes";

const App = () => {
  return (
    <>
      <OpenFirestoreProvider />
      <FullPageLoadingProvider>
        <MantineProvider>
          <SecureLoginProvider>
            <Routes />
          </SecureLoginProvider>
        </MantineProvider>
      </FullPageLoadingProvider>
    </>
  );
};

export default App;
