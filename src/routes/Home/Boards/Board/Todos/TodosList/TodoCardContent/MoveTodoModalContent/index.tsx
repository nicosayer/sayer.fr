import { Button, Group, Stack } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import BoardSelect from "components/molecules/Select/Board";
import { collection, deleteDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useState } from "react";
import { useBoards } from "routes/Home/Boards/Provider";
import { Collection, TodoDocument } from "types/firebase/collections";
import { addDoc, db } from "utils/firebase";

export interface MoveTodoModalContentProps {
  todo: TodoDocument;
}

const MoveTodoModalContent: FC<MoveTodoModalContentProps> = ({ todo }) => {
  const [loading, start, stop] = useBooleanState();
  const { boards } = useBoards();
  const [boardId, setBoardId] = useState(todo.ref?.parent.parent?.id ?? null);

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
              addDoc<TodoDocument>(
                collection(db, `boards/${boardId}/${Collection.todos}`),
                {
                  name: todo.name,
                  description: todo.description,
                  openedAt: todo.openedAt,
                  openedBy: todo.openedBy,
                  closedAt: todo.closedAt,
                  closedBy: todo.closedBy,
                }
              )
                .then(() => {
                  if (todo.ref) {
                    return deleteDoc(todo.ref);
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

export default MoveTodoModalContent;
