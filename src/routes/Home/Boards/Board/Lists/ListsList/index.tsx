import { Stack } from "@mantine/core";
import NoResult from "components/organisms/NoResult";
import Pagination from "components/organisms/Pagination";
import { sortBy } from "lodash";
import PaginationProvider from "providers/Pagination";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { sanitize, searchString } from "utils/string";
import ListCard from "./ListCard";

export interface ListsListProps {
  search: string;
}

const ListsList: FC<ListsListProps> = ({ search }) => {
  const { lists } = useBoard();

  const filteredLists = useMemo(() => {
    return sortBy(
      (lists ?? []).filter((list) => {
        return searchString(list.name ?? "", search);
      }),
      (list) => sanitize(String(list.name))
    );
  }, [lists, search]);

  if (!filteredLists.length) {
    return <NoResult />;
  }

  return (
    <PaginationProvider totalItems={filteredLists.length}>
      {({ page, pageSize }) => (
        <Stack>
          {filteredLists
            .slice((page - 1) * pageSize, page * pageSize)
            .map((list) => {
              return <ListCard key={list.id} list={list} />;
            })}
          <Pagination />
        </Stack>
      )}
    </PaginationProvider>
  );
};

export default ListsList;
