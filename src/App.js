import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "styles/global.css";

import { UserProvider } from "providers/UserProvider";
import Root from "pages";
import { ToasterProvider } from "providers/ToasterProvider";
import { WindowSizeProvider } from "providers/WindowSizeProvider";
import { DataProvider } from "providers/useData";

function App() {
  return (
    <UserProvider>
      <ToasterProvider>
        <WindowSizeProvider>
          <DataProvider>
            <Root />
          </DataProvider>
        </WindowSizeProvider>
      </ToasterProvider>
    </UserProvider>
  );
}

export default App;
