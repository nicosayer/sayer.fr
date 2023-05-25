import { Button, Group, Stack } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import BoardSelect from "components/molecules/Select/Board";
import { collection, deleteDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useState } from "react";
import { useBoards } from "routes/Home/Boards/Provider";
import { Collection, GroceryDocument } from "types/firebase/collections";
import { addDoc, db } from "utils/firebase";

export interface MoveGroceryModalContentProps {
  grocery: GroceryDocument;
}

const MoveGroceryModalContent: FC<MoveGroceryModalContentProps> = ({
  grocery,
}) => {
  const [loading, start, stop] = useBooleanState();
  const { boards } = useBoards();
  const [boardId, setBoardId] = useState(
    grocery.ref?.parent.parent?.id ?? null
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
              addDoc<GroceryDocument>(
                collection(db, `boards/${boardId}/${Collection.groceries}`),
                {
                  name: grocery.name,
                  openedAt: grocery.openedAt,
                  openedBy: grocery.openedBy,
                  closedAt: grocery.closedAt,
                  closedBy: grocery.closedBy,
                }
              )
                .then(() => {
                  if (grocery.ref) {
                    return deleteDoc(grocery.ref);
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

export default MoveGroceryModalContent;
