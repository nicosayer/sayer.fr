import { Stack } from "@mantine/core";
import NoResult from "components/organisms/NoResult";
import Pagination from "components/organisms/Pagination";
import { sortBy } from "lodash";
import PaginationProvider from "providers/Pagination";
import { FC, useMemo } from "react";
import ListCard from "routes/Home/Boards/Board/Lists/ListsList/ListCard";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { sanitize, searchString } from "utils/string";

export interface ListsListProps {
  search: string;
}

const ListsList: FC<ListsListProps> = ({ search }) => {
  const { lists, listItems } = useBoard();

  const filteredLists = useMemo(() => {
    return sortBy(
      (lists ?? []).filter((list) => {
        const filteredListItems = (listItems ?? []).filter((listItem) => {
          return list.id && listItem.ref?.path.includes(list.id);
        });

        return (
          searchString(list.name ?? "", search) ||
          filteredListItems.some((listItem) => {
            return searchString(listItem.name ?? "", search);
          })
        );
      }),
      (list) => {
        return sanitize(String(list.name));
      }
    );
  }, [lists, listItems, search]);

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
              return (
                <ListCard
                  key={list.id}
                  list={list}
                  listItems={(listItems ?? []).filter((listItem) => {
                    return list.id && listItem.ref?.path.includes(list.id);
                  })}
                />
              );
            })}
          <Pagination />
        </Stack>
      )}
    </PaginationProvider>
  );
};

export default ListsList;
