import { Button, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { auth, db } from "configs/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { Collection } from "types/firebase/collections";

const NewBoard = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [signOut] = useSignOut(auth);

  return (
    <Stack className="flex items-center justify-center h-full">
      <Button
        leftIcon={<IconPlus />}
        loading={loading}
        onClick={() => {
          if (user?.email) {
            setLoading(true);
            addDoc(collection(db, Collection.boards), {
              users: [user.email],
              name: `Board de ${user.displayName ?? user.email}`,
            }).finally(() => {
              setLoading(false);
            });
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
