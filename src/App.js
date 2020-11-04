import "@blueprintjs/core/lib/css/blueprint.css";
import "styles/global.css";

import { CurrentUserProvider } from "providers/CurrentUserProvider";
import Root from "pages";
import { EncryptionProvider } from "providers/EncryptionProvider";

function App() {
  return (
    <CurrentUserProvider>
      <EncryptionProvider>
        <Root />
      </EncryptionProvider>
    </CurrentUserProvider>
  );
}

export default App;
