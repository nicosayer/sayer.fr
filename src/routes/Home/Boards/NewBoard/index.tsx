import { Button, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { auth, db } from "configs/firebase";
import { addDoc, collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { Collection } from "types/firebase/collections";
import { ONE_SECOND } from "utils/time";

const NewBoard = () => {
  const [user] = useAuthState(auth);
  const [loading, start, stop] = useBooleanState({ stopDelay: ONE_SECOND });
  const [signOut] = useSignOut(auth);

  return (
    <Stack className="flex items-center justify-center h-full">
      <Button
        leftIcon={<IconPlus />}
        loading={loading}
        onClick={() => {
          if (user?.email) {
            start();
            addDoc(collection(db, Collection.boards), {
              users: [user.email],
              name: `Board de ${user.displayName ?? user.email}`,
            }).finally(stop);
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

export default NewBoard;
