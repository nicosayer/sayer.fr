import { ActionIcon, Group, Input, PasswordInput } from "@mantine/core";
import { IconArrowRight, IconShieldLock } from "@tabler/icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import useBooleanState from "hooks/useBooleanState";
import { FC, useCallback, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "utils/firebase";

const SecureLogin: FC = () => {
  const [user] = useAuthState(auth);
  const [error, setError] = useState();
  const [loading, start, stop] = useBooleanState();
  const [password, setPassword] = useState("");

  const handleSubmit = useCallback(() => {
    if (password && user?.email) {
      start();
      signInWithEmailAndPassword(auth, user.email, password)
        .catch(setError)
        .finally(stop);
    }
  }, [password, start, stop, user?.email]);

  return (
    <div className="mx-auto max-w-[256px] text-center">
      <IconShieldLock size={36} className="text-gray-500" />
      <Input.Wrapper label="Entrer votre mot de passe">
        <Group spacing="xs">
          <PasswordInput
            className="flex-1"
            disabled={loading}
            placeholder="••••••••••••"
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
            autoFocus
            error={Boolean(error)}
            onKeyDown={({ key }) => {
              if (key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <ActionIcon variant="default" size={36} onClick={handleSubmit}>
            <IconArrowRight />
          </ActionIcon>
        </Group>
      </Input.Wrapper>
    </div>
  );
};

export default SecureLogin;
