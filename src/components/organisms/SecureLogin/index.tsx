import { ActionIcon, Group, Input, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDidUpdate } from "@mantine/hooks";
import { IconArrowRight, IconShieldLock } from "@tabler/icons";
import { FC } from "react";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth } from "utils/firebase";

const SecureLogin: FC = () => {
  const [user] = useAuthState(auth);
  const [signInWithEmailAndPassword, , loading, error] =
    useSignInWithEmailAndPassword(auth);

  const form = useForm({
    initialValues: {
      password: "",
    },

    validate: {
      password: (password) => {
        return password.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
    },
  });

  useDidUpdate(() => {
    if (error) {
      form.setFieldError("password", true);
    }
  }, [error, form]);

  return (
    <div className="mx-auto max-w-[256px] text-center">
      <IconShieldLock size={36} className="text-gray-500" />
      <form
        onSubmit={form.onSubmit((values) => {
          if (user?.email) {
            signInWithEmailAndPassword(user.email, values.password);
          }
        })}
      >
        <Input.Wrapper label="Entrer votre mot de passe">
          <Group spacing="xs">
            <PasswordInput
              className="flex-1"
              disabled={loading}
              placeholder="••••••••••••"
              {...form.getInputProps("password")}
            />
            <ActionIcon
              variant={error ? "outline" : "default"}
              color={error ? "red" : undefined}
              size={36}
              type="submit"
              loading={loading}
            >
              <IconArrowRight />
            </ActionIcon>
          </Group>
        </Input.Wrapper>
      </form>
    </div>
  );
};

export default SecureLogin;
