import { Card, Stack } from "@mantine/core";
import NoResult from "components/organisms/NoResult";
import NoteCardContent from "components/organisms/NoteCardContent";
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
          note.base64 &&
          searchString(
            `${note.name}${note.text}${note.tag}${formatDate(
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
  }, [notes, search]);

  if (!filteredNotes.length) {
    return <NoResult />;
  }

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
