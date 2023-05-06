import { Stack } from "@mantine/core";
import NoResult from "components/organisms/NoResult";
import { sortBy } from "lodash";
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
    <Stack>
      {filteredDocuments.map((document) => {
        return <DocumentCard key={document.id} document={document} />;
      })}
    </Stack>
  );
};

export default DocumentsList;
