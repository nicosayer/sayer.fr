import "@blueprintjs/core/lib/css/blueprint.css";
import "styles/global.css";

import Root from "pages";
import { ToasterProvider } from "providers/ToasterProvider";

function App() {
  return (
    <ToasterProvider>
      <Root />
    </ToasterProvider>
  );
}

export default App;
