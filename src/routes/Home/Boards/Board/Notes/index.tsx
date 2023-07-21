import { Button, Group, Stack, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import SearchTextInput from "components/molecules/TextInput/Search";
import { collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import useSearch from "hooks/useSearch";
import useWindowSize from "hooks/useWindowSize";
import { FC, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Note from "routes/Home/Boards/Board/Notes/Note";
import NotesList from "routes/Home/Boards/Board/Notes/NotesList";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { Collection, NoteDocument } from "types/firebase/collections";
import { formatDate } from "utils/dayjs";
import { addDoc } from "utils/firebase";

const Notes: FC = () => {
  const { board, loadingNotes, notes } = useBoard();
  const { boardId } = useParams();
  const [loadingNew, start, stop] = useBooleanState();
  const navigate = useNavigate();
  const { largerThan } = useWindowSize();
  const { search, setSearch, debouncedSearch } = useSearch();

  const createNoteAndOpen = useCallback(() => {
    if (board?.ref) {
      start();
      const now = new Date();

      addDoc<NoteDocument>(collection(board.ref, Collection.notes), {
        name: `Note du ${formatDate(now, "D MMM YYYY")}`,
        base64: "",
        date: formatDate(now),
      })
        .then((note) => navigate(`/boards/${boardId}/notes/${note.id}`))
        .finally(stop);
    }
  }, [board?.ref, boardId, navigate, start, stop]);

  if (!notes || loadingNotes) {
    return <LoadingOverlay visible />;
  }

  if (!notes.find((note) => note.base64)) {
    return (
      <>
        <Note />
        <div className="flex items-center justify-center h-full">
          <Button
            loading={loadingNew}
            size="lg"
            leftIcon={<IconPlus size={18} />}
            onClick={createNoteAndOpen}
          >
            {largerThan("md") ? "Ajouter votre première note" : "Nouvelle note"}
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
          <Group spacing="xs">
            <Text weight={500}>Notes</Text>
            <Text c="dimmed">({notes.length})</Text>
          </Group>
          <Group>
            <SearchTextInput search={search} setSearch={setSearch} />
            <Button
              loading={loadingNew}
              variant="default"
              leftIcon={<IconPlus size={18} />}
              onClick={createNoteAndOpen}
            >
              Nouvelle note
            </Button>
          </Group>
        </Group>
        <NotesList search={debouncedSearch} />
      </Stack>
    </>
  );
};

export default Notes;
