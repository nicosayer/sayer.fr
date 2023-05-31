import { Stack } from "@mantine/core";
import NoResult from "components/organisms/NoResult";
import Pagination from "components/organisms/Pagination";
import { sortBy } from "lodash";
import PaginationProvider from "providers/Pagination";
import { FC, useMemo } from "react";
import ChoreCard from "routes/Home/Boards/Board/Chores/ChoresList/ChoreCard";
import { ChoreDocument } from "types/firebase/collections";
import { sanitize, searchString } from "utils/string";

export interface ChoresListProps {
  search: string;
  choresWithDates: (ChoreDocument & {
    previousDate: string;
    nextDate: string;
    nextDoneDate: string;
    lastDoneDate: string;
  })[];
}

const ChoresList: FC<ChoresListProps> = ({ search, choresWithDates }) => {
  const filteredChores = useMemo(() => {
    return sortBy(
      (choresWithDates ?? []).filter((choreWithDates) => {
        return searchString(choreWithDates.name ?? "", search);
      }),
      [(chore) => chore.nextDoneDate, (chore) => sanitize(String(chore.name))]
    );
  }, [choresWithDates, search]);

  if (!filteredChores.length) {
    return <NoResult />;
  }

  return (
    <PaginationProvider totalItems={filteredChores.length}>
      {({ page, pageSize }) => (
        <Stack>
          {filteredChores
            .slice((page - 1) * pageSize, page * pageSize)
            .map((chore) => {
              return <ChoreCard key={chore.id} chore={chore} />;
            })}
          <Pagination />
        </Stack>
      )}
    </PaginationProvider>
  );
};

export default ChoresList;
