import "@blueprintjs/core/lib/css/blueprint.css";
import "styles/global.css";

import { UserProvider } from "providers/UserProvider";
import Root from "pages";
import { EncryptionProvider } from "providers/EncryptionProvider";
import { ToasterProvider } from "providers/ToasterProvider";
import { SearchProvider } from "providers/SearchProvider";

function App() {
  return (
    <EncryptionProvider>
      <UserProvider>
        <ToasterProvider>
          <SearchProvider>
            <Root />
          </SearchProvider>
        </ToasterProvider>
      </UserProvider>
    </EncryptionProvider>
  );
}

export default App;
