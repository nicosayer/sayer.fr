import {
  Button,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons";
import dayjs from "dayjs";
import { addDoc, collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Collection, NoteDocument } from "types/firebase/collections";
import { ALL_BOARDS_SLUG } from "utils/boards";
import { formatDate } from "utils/dayjs";
import { useBoard } from "../Provider";
import Note from "./Note";
import NotesCards from "./NotesCards";

const Notes: FC = () => {
  const { boards, loading, notes } = useBoard();
  const [search, setSearch] = useState("");
  const [loadingNew, start, stop] = useBooleanState();
  const navigate = useNavigate();

  if (!notes || loading) {
    return <LoadingOverlay visible />;
  }

  if (!notes?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <Button
          loading={loadingNew}
          size="lg"
          leftIcon={<IconPlus size={18} />}
          onClick={() => {
            if (boards?.[0].ref) {
              start();
              addDoc<NoteDocument>(
                // TODO
                collection(boards[0].ref, Collection.notes),
                {
                  name: `Note du ${formatDate()}`,
                  content: "",
                  date: dayjs().format("YYYY-MM-DD"),
                }
              )
                .then((note) =>
                  navigate(
                    `/boards/${boards[0].id ?? ALL_BOARDS_SLUG}/notes/${
                      note.id
                    }`
                  )
                )
                .finally(stop);
            }
          }}
        >
          Ajouter votre première note
        </Button>
      </div>
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
              onClick={() => {
                if (boards?.[0].ref) {
                  start();
                  addDoc<NoteDocument>(
                    // TODO
                    collection(boards[0].ref, Collection.notes),
                    {
                      name: `Note du ${formatDate()}`,
                      content: "",
                      date: dayjs().format("YYYY-MM-DD"),
                    }
                  )
                    .then((note) =>
                      navigate(
                        `/boards/${boards[0].id ?? ALL_BOARDS_SLUG}/notes/${
                          note.id
                        }`
                      )
                    )
                    .finally(stop);
                }
              }}
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
