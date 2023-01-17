import { ActionIcon, Group, Input, PasswordInput } from "@mantine/core";
import { IconArrowRight, IconShieldLock } from "@tabler/icons";
import { FC, useCallback, useState } from "react";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth } from "utils/firebase";

const SecureLogin: FC = () => {
  const [password, setPassword] = useState("");
  const [user] = useAuthState(auth);
  const [signInWithEmailAndPassword, , loading, error] =
    useSignInWithEmailAndPassword(auth);

  const handleSubmit = useCallback(() => {
    if (password && user?.email) {
      signInWithEmailAndPassword(user.email, password);
    }
  }, [password, signInWithEmailAndPassword, user?.email]);

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
            error={Boolean(error)}
            onKeyDown={({ key }) => {
              if (key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <ActionIcon
            variant={error ? "outline" : "default"}
            color={error ? "red" : undefined}
            size={36}
            onClick={handleSubmit}
            loading={loading}
          >
            <IconArrowRight />
          </ActionIcon>
        </Group>
      </Input.Wrapper>
    </div>
  );
};

export default SecureLogin;
