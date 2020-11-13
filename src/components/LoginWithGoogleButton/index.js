import { Button } from "components/Button";
import { useWindowSize } from "providers/WindowSizeProvider";
import { loginWithGoogle } from "utils/auth";

export const LoginWithGoogleButton = (props) => {
  const { isWebview } = useWindowSize();

  if (isWebview) {
    return null;
  }

  return <Button onClick={loginWithGoogle} {...props} />;
};
