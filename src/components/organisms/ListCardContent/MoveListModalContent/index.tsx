import { Button, Group, Stack } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import BoardSelect from "components/molecules/Select/Board";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useState } from "react";
import { useBoards } from "routes/Home/Boards/Provider";
import {
  Collection,
  ListDocument,
  ListItemDocument,
} from "types/firebase/collections";
import { runInParallel } from "utils/async";
import { addDoc, db } from "utils/firebase";

export interface MoveListModalContentProps {
  list: ListDocument;
}

const MoveListModalContent: FC<MoveListModalContentProps> = ({ list }) => {
  const [loading, start, stop] = useBooleanState();
  const { boards } = useBoards();
  const [boardId, setBoardId] = useState(list.ref?.parent.parent?.id ?? null);

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
              addDoc<ListDocument>(
                collection(db, `boards/${boardId}/${Collection.lists}`),
                {
                  name: list.name,
                }
              )
                .then((newList) => {
                  if (list.ref) {
                    return getDocs<ListItemDocument>(
                      collection(list.ref, Collection.listItems)
                    ).then((listItems) => {
                      return runInParallel(listItems.docs, (listItem) => {
                        const data = listItem.data();

                        return addDoc<ListItemDocument>(
                          collection(
                            db,
                            `boards/${boardId}/${Collection.lists}/${newList.id}/${Collection.listItems}`
                          ),
                          {
                            name: data.name,
                            status: data.status,
                            order: data.order,
                          }
                        ).then(() => {
                          return deleteDoc(listItem.ref);
                        });
                      });
                    });
                  }
                })
                .then(() => {
                  if (list.ref) {
                    return deleteDoc(list.ref);
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

export default MoveListModalContent;
