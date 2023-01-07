import { Card, Stack } from "@mantine/core";
import DocumentCardContent from "components/organisms/DocumentCardContent";
import NoResult from "components/organisms/NoResult";
import { sortBy } from "lodash";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { sanitize, searchString } from "utils/string";

export interface DocumentsCardsProps {
  search: string;
}

const DocumentsCards: FC<DocumentsCardsProps> = ({ search }) => {
  const { documents } = useBoard();

  const filteredDocuments = useMemo(() => {
    return sortBy(
      (documents ?? []).filter((document) => {
        return searchString(`${document.name}${document.tag}`, search);
      }),
      (document) => sanitize(`${document.name}${document.tag}`)
    );
  }, [documents, search]);

  if (!filteredDocuments.length) {
    return <NoResult />;
  }

  return (
    <Stack>
      {filteredDocuments.map((document) => {
        return (
          <Card key={document.id} withBorder>
            <DocumentCardContent document={document} />
          </Card>
        );
      })}
    </Stack>
  );
};

export default DocumentsCards;
