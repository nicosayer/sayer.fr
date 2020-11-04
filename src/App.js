import "@blueprintjs/core/lib/css/blueprint.css";
import "styles/global.css";

import { CurrentUserProvider } from "providers/CurrentUserProvider";
import Root from "pages";
import { EncryptionProvider } from "providers/EncryptionProvider";
import { ToasterProvider } from "providers/ToasterProvider";

function App() {
  return (
    <CurrentUserProvider>
      <EncryptionProvider>
        <ToasterProvider>
          <Root />
        </ToasterProvider>
      </EncryptionProvider>
    </CurrentUserProvider>
  );
}

export default App;
