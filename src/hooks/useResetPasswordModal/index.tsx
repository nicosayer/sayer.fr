import { Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { useMemo } from "react";
import {
  useAuthState,
  useSendPasswordResetEmail,
} from "react-firebase-hooks/auth";
import { EMPTY_FUNCTION } from "utils/empty";
import { auth } from "utils/firebase";

const useResetPasswordModal = () => {
  const [user] = useAuthState(auth);
  const [sendPasswordResetEmail, sending] = useSendPasswordResetEmail(auth);

  return useMemo(() => {
    return [
      (callback: () => void = EMPTY_FUNCTION) => {
        openConfirmModal({
          title: "Réinitialiser le mot de passe",
          centered: true,
          children: (
            <Text size="sm">
              Vous allez recevoir un email à <b>{user?.email}</b> afin de
              pouvoir réinitialiser votre mot de passe.
            </Text>
          ),
          labels: { confirm: "Valider", cancel: "Annuler" },
          onConfirm: () => {
            if (user?.email) {
              return sendPasswordResetEmail(user.email, {
                url: window.location.origin,
              }).then(callback);
            }
          },
        });
      },
      sending,
    ] as const;
  }, [sendPasswordResetEmail, sending, user?.email]);
};

export default useResetPasswordModal;
