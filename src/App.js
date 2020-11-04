import "@blueprintjs/core/lib/css/blueprint.css";
import "styles/global.css";

import { CurrentUserProvider } from "providers/CurrentUserProvider";
import Root from "pages";
import { EncryptionProvider } from "providers/EncryptionProvider";
import { ToasterProvider } from "providers/ToasterProvider";
import { SearchProvider } from "providers/SearchProvider";

function App() {
  return (
    <CurrentUserProvider>
      <EncryptionProvider>
        <ToasterProvider>
          <SearchProvider>
            <Root />
          </SearchProvider>
        </ToasterProvider>
      </EncryptionProvider>
    </CurrentUserProvider>
  );
}

export default App;
