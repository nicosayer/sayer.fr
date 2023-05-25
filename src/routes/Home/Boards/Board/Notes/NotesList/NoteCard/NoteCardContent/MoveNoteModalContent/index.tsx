import { Button, Group, Stack } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import BoardSelect from "components/molecules/Select/Board";
import { collection, deleteDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useState } from "react";
import { useBoards } from "routes/Home/Boards/Provider";
import { Collection, NoteDocument } from "types/firebase/collections";
import { addDoc, db } from "utils/firebase";

export interface MoveNoteModalContentProps {
  note: NoteDocument;
}

const MoveNoteModalContent: FC<MoveNoteModalContentProps> = ({ note }) => {
  const [loading, start, stop] = useBooleanState();
  const { boards } = useBoards();
  const [boardId, setBoardId] = useState(note.ref?.parent.parent?.id ?? null);

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
              addDoc<NoteDocument>(
                collection(db, `boards/${boardId}/${Collection.notes}`),
                {
                  name: note.name,
                  base64: note.base64,
                  text: note.text,
                  date: note.date,
                }
              )
                .then(() => {
                  if (note.ref) {
                    return deleteDoc(note.ref);
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

export default MoveNoteModalContent;
