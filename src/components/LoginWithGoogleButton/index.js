import { Button } from "components/Button";
import { useDevice } from "providers/DeviceProvider";
import { loginWithGoogle } from "utils/auth";

export const LoginWithGoogleButton = (props) => {
  const { isWebview } = useDevice();

  if (isWebview) {
    return null;
  }

  return <Button onClick={loginWithGoogle} {...props} />;
};
