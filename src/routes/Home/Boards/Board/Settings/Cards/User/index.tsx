import { Button, Card, Input, Stack, Text, TextInput } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { FC, useState } from "react";
import {
  useAuthState,
  useSendPasswordResetEmail,
} from "react-firebase-hooks/auth";
import { auth } from "utils/firebase";

const UserCard: FC = () => {
  const [user] = useAuthState(auth);
  const [sendPasswordResetEmail, sending] = useSendPasswordResetEmail(auth);
  const [disabled, setDisabled] = useState(false);

  if (!user?.email) {
    return null;
  }

  return (
    <Card withBorder>
      <Stack>
        <TextInput label="Email" value={user?.email} readOnly />
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
                      sendPasswordResetEmail(user.email).then(() => {
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
