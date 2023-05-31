import { Button, Group, Stack } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import BoardSelect from "components/molecules/Select/Board";
import { collection, deleteDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useState } from "react";
import { useBoards } from "routes/Home/Boards/Provider";
import { Collection, ChoreDocument } from "types/firebase/collections";
import { addDoc, db } from "utils/firebase";

export interface MoveChoreModalContentProps {
  chore: ChoreDocument;
}

const MoveChoreModalContent: FC<MoveChoreModalContentProps> = ({ chore }) => {
  const [loading, start, stop] = useBooleanState();
  const { boards } = useBoards();
  const [boardId, setBoardId] = useState(chore.ref?.parent.parent?.id ?? null);

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

              addDoc<ChoreDocument>(
                collection(db, `boards/${boardId}/${Collection.chores}`),
                {
                  name: chore.name,
                  startDate: chore.startDate,
                  lastDoneDate: chore.lastDoneDate,
                  frequency: chore.frequency,
                  unit: chore.unit,
                }
              )
                .then(() => {
                  if (chore.ref) {
                    return deleteDoc(chore.ref);
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

export default MoveChoreModalContent;
