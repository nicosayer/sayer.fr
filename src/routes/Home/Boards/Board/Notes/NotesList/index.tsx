import { Stack } from "@mantine/core";
import NoResult from "components/organisms/NoResult";
import Pagination from "components/organisms/Pagination";
import { orderBy } from "lodash";
import PaginationProvider from "providers/Pagination";
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

  const filteredNotes = useMemo(() => {
    return orderBy(
      (notes ?? []).filter((note) => {
        return (
          note.base64 &&
          searchString(
            `${note.name}${formatDate(note.date, "MMMM YYYY")}`,
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
    <PaginationProvider totalItems={filteredNotes.length}>
      {({ page, pageSize }) => (
        <Stack>
          {filteredNotes
            .slice((page - 1) * pageSize, page * pageSize)
            .map((note) => {
              return <NoteCard key={note.id} note={note} />;
            })}
          <Pagination />
        </Stack>
      )}
    </PaginationProvider>
  );
};

export default NotesList;
