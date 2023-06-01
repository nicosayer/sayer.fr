import { Button, Card, Input, Stack, Text, TextInput } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { FC, useState } from "react";
import {
  useAuthState,
  useSendPasswordResetEmail,
} from "react-firebase-hooks/auth";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import NameInput from "routes/Home/Boards/Board/Settings/Cards/User/NameInput";
import { auth } from "utils/firebase";

const UserCard: FC = () => {
  const [user] = useAuthState(auth);
  const [sendPasswordResetEmail, sending] = useSendPasswordResetEmail(auth);
  const [disabled, setDisabled] = useState(false);
  const { users } = useBoard();

  if (!user?.email) {
    return null;
  }

  return (
    <Card withBorder>
      <Stack>
        <NameInput defaultValue={users?.[user.email].name ?? ""} />
        <TextInput label="Email" value={user.email} readOnly />
        <Input.Wrapper label="Mot de passe">
          <div>
            <Button
              variant="default"
              loading={sending}
              disabled={disabled}
              onClick={() => {
                openConfirmModal({
                  title: "Réinitialiser le mot de passe",
                  centered: true,
                  children: (
                    <Text size="sm">
                      Voulez-vous recevoir un email afin de pouvoir
                      réinitialiser votre mot de passe ?
                    </Text>
                  ),
                  labels: { confirm: "Envoyer", cancel: "Annuler" },
                  onConfirm: () => {
                    if (user?.email) {
                      sendPasswordResetEmail(user.email, {
                        url: window.location.origin,
                      }).then(() => {
                        setDisabled(true);
                        showNotification({
                          color: "green",
                          message: "Email envoyé",
                        });
                      });
                    }
                  },
                });
              }}
            >
              Réinitialiser le mot de passe
            </Button>
          </div>
        </Input.Wrapper>
      </Stack>
    </Card>
  );
};

export default UserCard;
