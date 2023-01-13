import LoadingProvider from "providers/FullPageLoading";
import MantineProvider from "providers/Mantine";
import SecureLoginProvider from "providers/SecureLogin";
import Routes from "routes";

const App = () => {
  return (
    <LoadingProvider>
      <MantineProvider>
        <SecureLoginProvider>
          <Routes />
        </SecureLoginProvider>
      </MantineProvider>
    </LoadingProvider>
  );
};

export default App;
