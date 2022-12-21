import { Modal } from "@mantine/core";
import DocumentCardContent from "components/organisms/DocumentCardContent";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ALL_BOARDS_SLUG } from "utils/boards";
import { useBoard } from "../../Provider";

const Document: FC = () => {
  const { board, documents } = useBoard();
  const { documentId } = useParams();
  const navigate = useNavigate();

  const document = useMemo(() => {
    return documents?.find((document) => document.id === documentId);
  }, [documentId, documents]);

  if (!document) {
    return null;
  }

  return (
    <Modal
      opened={Boolean(documentId)}
      onClose={() =>
        navigate(`/boards/${board?.id ?? ALL_BOARDS_SLUG}/documents`)
      }
      centered
      withCloseButton={false}
      trapFocus={false}
      size="xl"
    >
      <DocumentCardContent document={document} />
    </Modal>
  );
};

export default Document;
