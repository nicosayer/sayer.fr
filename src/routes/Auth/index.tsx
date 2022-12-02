import { Button } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons";
import { auth } from "configs/firebase";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

const Auth = () => {
  const [signInWithGoogle, , loadingSignInWithGoogle] =
    useSignInWithGoogle(auth);

  return (
    <div className="flex items-center justify-center h-full">
      <Button
        leftIcon={<IconBrandGoogle />}
        onClick={() => signInWithGoogle()}
        loading={loadingSignInWithGoogle}
      >
        Se connecter avec Google
      </Button>
    </div>
  );
};

export default Auth;
