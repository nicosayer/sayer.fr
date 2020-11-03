import { Button, Intent } from "@blueprintjs/core";
import { Center } from "components/Center";
import { loginWithGoogle } from "utils/auth";

function Login({ loading }) {
  return (
    <Center>
      <Button
        large
        onClick={loginWithGoogle}
        rightIcon="arrow-right"
        intent={Intent.SUCCESS}
        loading={loading}
      >
        Login with Google
      </Button>
    </Center>
  );
}

export default Login;
