import { Intent, NonIdealState } from "@blueprintjs/core";
import { Center } from "components/Center";
import { LoginWithGoogleButton } from "components/LoginWithGoogleButton";
import { REACT_APP_URL } from "config/env";
import { useWindowSize } from "providers/WindowSizeProvider";

function Login({ loading }) {
  const { isWebview } = useWindowSize();

  return (
    <Center>
      <LoginWithGoogleButton
        large
        rightIcon="arrow-right"
        intent={Intent.SUCCESS}
        loading={loading}
        style={{ whiteSpace: "nowrap" }}
      >
        Login with Google
      </LoginWithGoogleButton>
      {isWebview && (
        <NonIdealState
          icon="shield"
          title={<code>{REACT_APP_URL}</code>}
          description="Veuillez ouvrir l'application depuis votre navigateur"
        />
      )}
    </Center>
  );
}

export default Login;
