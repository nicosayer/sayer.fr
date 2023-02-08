import { Button, Group, Stack } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import BoardSelect from "components/molecules/Select/Board";
import { collection, deleteDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useState } from "react";
import { useBoards } from "routes/Home/Boards/Provider";
import { Collection, CredentialDocument } from "types/firebase/collections";
import { addDoc, db } from "utils/firebase";

export interface MoveCredentialModalProps {
  credential: CredentialDocument;
}

const MoveCredentialModal: FC<MoveCredentialModalProps> = ({ credential }) => {
  const [loading, start, stop] = useBooleanState();
  const { boards } = useBoards();
  const [boardId, setBoardId] = useState(
    credential.ref?.parent.parent?.id ?? null
  );

  return (
    <Stack>
      <BoardSelect
        label="Board"
        placeholder="Board de John Doe"
        boards={boards ?? []}
        disabled={loading}
        value={boardId}
        onChange={(value) => {
          setBoardId(value);
        }}
      />
      <div className="flex ml-auto">
        <Group>
          <Button
            variant="default"
            disabled={loading}
            onClick={() => {
              closeAllModals();
            }}
          >
            Annuler
          </Button>
          <Button
            loading={loading}
            onClick={() => {
              start();
              addDoc<CredentialDocument>(
                collection(db, `boards/${boardId}/${Collection.credentials}`),
                {
                  name: credential.name,
                  url: credential.url,
                  username: credential.username,
                  password: credential.password,
                }
              )
                .then(() => {
                  if (credential.ref) {
                    return deleteDoc(credential.ref);
                  }
                })
                .then(() => {
                  closeAllModals();
                })
                .finally(stop);
            }}
          >
            Déplacer
          </Button>
        </Group>
      </div>
    </Stack>
  );
};

export default MoveCredentialModal;
