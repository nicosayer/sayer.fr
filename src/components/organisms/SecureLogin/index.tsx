import { PasswordInput } from "@mantine/core";
import { IconShieldLock } from "@tabler/icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import useBooleanState from "hooks/useBooleanState";
import { FC, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "utils/firebase";

const SecureLogin: FC = () => {
  const [user] = useAuthState(auth);
  const [error, setError] = useState();
  const [loading, start, stop] = useBooleanState();

  return (
    <div className="mx-auto max-w-[256px] text-center">
      <IconShieldLock size={36} className="text-gray-500" />
      <PasswordInput
        disabled={loading}
        label="Entrer votre mot de passe"
        placeholder="••••••••••••"
        autoFocus
        error={Boolean(error)}
        onKeyDown={({ key, currentTarget }) => {
          if (key === "Enter" && currentTarget.value && user?.email) {
            start();
            signInWithEmailAndPassword(auth, user.email, currentTarget.value)
              .catch(setError)
              .finally(stop);
          }
        }}
      />
    </div>
  );
};

export default SecureLogin;
