import "@blueprintjs/core/lib/css/blueprint.css";
import "styles/global.css";

import { CurrentUserProvider } from "providers/CurrentUserProvider";
import Root from "pages";

function App() {
  return (
    <CurrentUserProvider>
      <Root />
    </CurrentUserProvider>
  );
}

export default App;
