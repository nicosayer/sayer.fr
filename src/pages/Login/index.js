import { Intent, NonIdealState } from "@blueprintjs/core";
import { Center } from "components/Center";
import { LoginWithGoogleButton } from "components/LoginWithGoogleButton";
import { useDevice } from "providers/DeviceProvider";

function Login({ loading }) {
  const { isWebview } = useDevice();

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
          description="Veuillez ouvrir l'application depuis votre navigateur"
        />
      )}
    </Center>
  );
}

export default Login;
