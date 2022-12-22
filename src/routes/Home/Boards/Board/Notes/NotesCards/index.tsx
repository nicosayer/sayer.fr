import { Card, Stack } from "@mantine/core";
import NoteCardContent from "components/organisms/NoteCardContent";
import dayjs from "dayjs";
import { orderBy } from "lodash";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { formatDate } from "utils/dayjs";
import { searchString } from "utils/string";

export interface NotesCardsProps {
  search: string;
}

const NotesCards: FC<NotesCardsProps> = ({ search }) => {
  const { notes } = useBoard();

  const filteredNotes = useMemo(() => {
    return orderBy(
      (notes ?? []).filter((note) => {
        return (
          note.content &&
          searchString(
            `${note.name}${note.tag}${formatDate(note.date, "MMMM YYYY")}`,
            search
          )
        );
      }),
      "date",
      "desc"
    );
  }, [notes, search]);

  return (
    <Stack>
      {filteredNotes.map((note) => {
        return (
          <Card key={note.id} withBorder>
            <NoteCardContent note={note} />
          </Card>
        );
      })}
    </Stack>
  );
};

export default NotesCards;
