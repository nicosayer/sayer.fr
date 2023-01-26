import FullPageLoadingProvider from "providers/FullPageLoading";
import MantineProvider from "providers/Mantine";
import SecureLoginProvider from "providers/SecureLogin";
import Routes from "routes";

const App = () => {
  return (
    <FullPageLoadingProvider>
      <MantineProvider>
        <SecureLoginProvider>
          <Routes />
        </SecureLoginProvider>
      </MantineProvider>
    </FullPageLoadingProvider>
  );
};

export default App;
