import {
  Button,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { closeAllModals, openModal } from "@mantine/modals";
import { IconArrowRight, IconPlus, IconSearch } from "@tabler/icons";
import dayjs from "dayjs";
import { addDoc, collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BoardDocument,
  Collection,
  NoteDocument,
} from "types/firebase/collections";
import { formatDate } from "utils/dayjs";
import { useBoard } from "../Provider";
import Note from "./Note";
import NotesCards from "./NotesCards";

const Notes: FC = () => {
  const { boards, loading, notes } = useBoard();
  const { boardId } = useParams();
  const [search, setSearch] = useState("");
  const [loadingNew, start, stop] = useBooleanState();
  const navigate = useNavigate();

  const createNoteAndOpen = useCallback(
    (board: BoardDocument) => {
      if (board.ref) {
        start();
        addDoc<NoteDocument>(collection(board.ref, Collection.notes), {
          name: `Note du ${formatDate()}`,
          content: "",
          date: dayjs().format("YYYY-MM-DD"),
        })
          .then((note) => navigate(`/boards/${boardId}/notes/${note.id}`))
          .finally(stop);
      }
    },
    [boardId, navigate, start, stop]
  );

  const onClick = useCallback(() => {
    if ((boards?.length ?? 0) > 1) {
      openModal({
        centered: true,
        title: "Choisir un board",
        children: (
          <Stack>
            {boards?.map((board) => (
              <Button
                key={board.id}
                variant="light"
                rightIcon={<IconArrowRight size={18} />}
                onClick={() => {
                  closeAllModals();
                  createNoteAndOpen(board);
                }}
              >
                {board.name}
              </Button>
            ))}
          </Stack>
        ),
      });
    } else if (boards?.[0]) {
      createNoteAndOpen(boards[0]);
    }
  }, [boards, createNoteAndOpen]);

  if (!notes || loading) {
    return <LoadingOverlay visible />;
  }

  if (!notes.find((note) => note.content)) {
    return (
      <>
        <Note />
        <div className="flex items-center justify-center h-full">
          <Button
            loading={loadingNew}
            size="lg"
            leftIcon={<IconPlus size={18} />}
            onClick={onClick}
          >
            Ajouter votre première note
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Note />
      <Stack>
        <Group position="apart" className="sticky z-50">
          <Text fw={500}>Notes</Text>
          <Group>
            <TextInput
              placeholder="Rechercher"
              variant="filled"
              icon={<IconSearch size={18} />}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
            <Button
              loading={loadingNew}
              variant="default"
              leftIcon={<IconPlus size={18} />}
              onClick={onClick}
            >
              Nouvelle note
            </Button>
          </Group>
        </Group>
        <NotesCards search={search} />
      </Stack>
    </>
  );
};

export default Notes;
