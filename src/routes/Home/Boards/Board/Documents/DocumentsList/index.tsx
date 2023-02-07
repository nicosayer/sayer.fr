import { Stack } from "@mantine/core";
import NoResult from "components/organisms/NoResult";
import useGetTags from "hooks/useGetTags";
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
  const getTags = useGetTags();

  const filteredDocuments = useMemo(() => {
    return sortBy(
      (documents ?? []).filter((document) => {
        const tags = getTags(document.tags);
        return searchString(
          `${document.name}${tags.map((tag) => tag.name)}`,
          search
        );
      }),
      (document) => sanitize(String(document.name))
    );
  }, [documents, search, getTags]);

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
