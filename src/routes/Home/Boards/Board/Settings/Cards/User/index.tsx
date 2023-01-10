import { Button, Card, Input, Stack, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { sendPasswordResetEmail } from "firebase/auth";
import useBooleanState from "hooks/useBooleanState";
import { FC, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "utils/firebase";

const UserCard: FC = () => {
  const [user] = useAuthState(auth);
  const [loading, start, stop] = useBooleanState();
  const [disabled, setDisabled] = useState(false);

  user?.getIdTokenResult().then((idTokenResult) => {
    console.log(idTokenResult);
  });

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
              loading={loading}
              disabled={disabled}
              onClick={() => {
                if (user?.email) {
                  start();
                  sendPasswordResetEmail(auth, user.email).then(() => {
                    setDisabled(true);
                    stop();
                    showNotification({
                      color: "green",
                      title: "Email envoyé avec succès",
                      message:
                        "Vous allez recevoir les informations vous invitant à réinitialiser votre mot de passe par email",
                    });
                  });
                }
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
