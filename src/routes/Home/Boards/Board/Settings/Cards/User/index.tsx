import {
  Button,
  Card,
  Group,
  Input,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { IconCheck, IconMoon, IconSun } from "@tabler/icons-react";
import useResetPasswordModal from "hooks/useResetPasswordModal";
import { FC, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import NameInput from "routes/Home/Boards/Board/Settings/Cards/User/NameInput";
import { auth } from "utils/firebase";

const UserCard: FC = () => {
  const [user] = useAuthState(auth);
  const { users } = useBoard();
  const [resetPasswordModal, sending] = useResetPasswordModal();
  const [passwordResetEmailSent, setPasswordResetEmailSent] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  if (!user?.email) {
    return null;
  }

  return (
    <Card withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Text weight={500}>Paramètres utilisateur</Text>
      </Card.Section>
      <Card.Section inheritPadding py="md">
        <Stack>
          <NameInput defaultValue={users?.[user.email].name ?? ""} />
          <TextInput label="Email" value={user.email} readOnly />
          <Input.Wrapper label="Mot de passe">
            <div>
              <Button
                variant="default"
                loading={sending}
                leftIcon={passwordResetEmailSent && <IconCheck size={18} />}
                disabled={passwordResetEmailSent}
                onClick={() => {
                  resetPasswordModal(() => {
                    setPasswordResetEmailSent(true);
                  });
                }}
              >
                {passwordResetEmailSent
                  ? "Email envoyé"
                  : "Réinitialiser le mot de passe"}
              </Button>
            </div>
          </Input.Wrapper>
          <Input.Wrapper label="Thème de l'application">
            <div>
              <SegmentedControl
                className="w-64"
                value={colorScheme}
                onChange={(value: "light" | "dark") => toggleColorScheme(value)}
                data={[
                  {
                    value: "light",
                    label: (
                      <Group position="center" spacing="xs" noWrap>
                        <IconSun size={18} />
                        Clair
                      </Group>
                    ),
                  },
                  {
                    value: "dark",
                    label: (
                      <Group position="center" spacing="xs" noWrap>
                        <IconMoon size={18} />
                        Sombre
                      </Group>
                    ),
                  },
                ]}
              />
            </div>
          </Input.Wrapper>
        </Stack>
      </Card.Section>
    </Card>
  );
};

export default UserCard;
