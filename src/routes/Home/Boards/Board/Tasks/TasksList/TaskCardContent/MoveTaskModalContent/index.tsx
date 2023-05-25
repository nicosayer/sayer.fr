import { Button, Group, Stack } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import BoardSelect from "components/molecules/Select/Board";
import { collection, deleteDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useState } from "react";
import { useBoards } from "routes/Home/Boards/Provider";
import { Collection, TaskDocument } from "types/firebase/collections";
import { addDoc, db } from "utils/firebase";

export interface MoveTaskModalContentProps {
  task: TaskDocument;
}

const MoveTaskModalContent: FC<MoveTaskModalContentProps> = ({ task }) => {
  const [loading, start, stop] = useBooleanState();
  const { boards } = useBoards();
  const [boardId, setBoardId] = useState(task.ref?.parent.parent?.id ?? null);

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
              addDoc<TaskDocument>(
                collection(db, `boards/${boardId}/${Collection.tasks}`),
                {
                  name: task.name,
                  openedAt: task.openedAt,
                  openedBy: task.openedBy,
                  closedAt: task.closedAt,
                  closedBy: task.closedBy,
                }
              )
                .then(() => {
                  if (task.ref) {
                    return deleteDoc(task.ref);
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

export default MoveTaskModalContent;
