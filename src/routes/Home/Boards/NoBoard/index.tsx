import { Button, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import useBooleanState from "hooks/useBooleanState";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { newBoard } from "utils/boards";
import { auth } from "utils/firebase";
import { ONE_SECOND } from "utils/time";
import { useBoards } from "../Provider";

const NoBoard = () => {
  const { boards } = useBoards();
  const [user] = useAuthState(auth);
  const [loading, start, stop] = useBooleanState({ stopDelay: ONE_SECOND });
  const [signOut] = useSignOut(auth);

  return (
    <Stack className="flex items-center justify-center h-full">
      <Button
        size="lg"
        leftIcon={<IconPlus size={18} />}
        loading={loading}
        onClick={() => {
          if (user?.email) {
            start();
            newBoard({ user, boards: boards ?? [] }).finally(stop);
          }
        }}
      >
        Créer un nouveau board
      </Button>
      <Button variant="subtle" color="gray" onClick={signOut}>
        Se déconnecter
      </Button>
    </Stack>
  );
};

export default NoBoard;
