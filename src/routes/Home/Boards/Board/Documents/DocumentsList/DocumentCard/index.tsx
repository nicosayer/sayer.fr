import { Card } from "@mantine/core";
import DocumentCardContent from "components/organisms/DocumentCardContent";
import { FC } from "react";
import { DocumentDocument } from "types/firebase/collections";

export interface DocumentCardProps {
  document: DocumentDocument;
}

const DocumentCard: FC<DocumentCardProps> = ({ document }) => {
  return (
    <Card withBorder>
      <DocumentCardContent document={document} />
    </Card>
  );
};

export default DocumentCard;
