import { Button } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "utils/firebase";

const Auth = () => {
  const [signInWithGoogle, , loading, error] =
    useSignInWithGoogle(auth);

  return (
    <div className="flex items-center justify-center h-full">
      <Button
        size="lg"
        color="teal"
        rightIcon={<IconArrowRight size={18} />}
        onClick={() => signInWithGoogle()}
        loading={loading && !error}
      >
        Se connecter avec Google
      </Button>
    </div>
  );
};

export default Auth;
