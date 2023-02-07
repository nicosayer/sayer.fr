import { Stack } from "@mantine/core";
import NoResult from "components/organisms/NoResult";
import useGetTags from "hooks/useGetTags";
import { orderBy } from "lodash";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { formatDate } from "utils/dayjs";
import { searchString } from "utils/string";
import NoteCard from "./NoteCard";

export interface NotesListProps {
  search: string;
}

const NotesList: FC<NotesListProps> = ({ search }) => {
  const { notes } = useBoard();
  const getTags = useGetTags();

  const filteredNotes = useMemo(() => {
    return orderBy(
      (notes ?? []).filter((note) => {
        const tags = getTags(note.tags);

        return (
          note.base64 &&
          searchString(
            `${note.name}${note.text}${tags.map((tag) => tag.name)}${formatDate(
              note.date,
              "MMMM YYYY"
            )}`,
            search
          )
        );
      }),
      "date",
      "desc"
    );
  }, [notes, search, getTags]);

  if (!filteredNotes.length) {
    return <NoResult />;
  }

  return (
    <Stack>
      {filteredNotes.map((note) => {
        return <NoteCard key={note.id} note={note} />;
      })}
    </Stack>
  );
};

export default NotesList;
