import LoadingProvider from "providers/FullPageLoading";
import MantineProvider from "providers/Mantine";
import Routes from "routes";

const App = () => {
  return (
    <LoadingProvider>
      <MantineProvider>
        <Routes />
      </MantineProvider>
    </LoadingProvider>
  );
};

export default App;
