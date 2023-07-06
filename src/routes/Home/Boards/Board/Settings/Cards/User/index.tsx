import { Button, Card, Input, Stack, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
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
      </Stack>
    </Card>
  );
};

export default UserCard;
