import { Stack } from "@mantine/core";
import NoResult from "components/organisms/NoResult";
import Pagination from "components/organisms/Pagination";
import { sortBy } from "lodash";
import PaginationProvider from "providers/Pagination";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { sanitize, searchString } from "utils/string";
import DocumentCard from "./DocumentCard";

export interface DocumentsListProps {
  search: string;
}

const DocumentsList: FC<DocumentsListProps> = ({ search }) => {
  const { documents } = useBoard();

  const filteredDocuments = useMemo(() => {
    return sortBy(
      (documents ?? []).filter((document) => {
        return searchString(document.name ?? "", search);
      }),
      (document) => sanitize(String(document.name))
    );
  }, [documents, search]);

  if (!filteredDocuments.length) {
    return <NoResult />;
  }

  return (
    <PaginationProvider totalItems={filteredDocuments.length}>
      {({ page, pageSize }) => (
        <Stack>
          {filteredDocuments
            .slice((page - 1) * pageSize, page * pageSize)
            .map((document) => {
              return <DocumentCard key={document.id} document={document} />;
            })}
          <Pagination />
        </Stack>
      )}
    </PaginationProvider>
  );
};

export default DocumentsList;
