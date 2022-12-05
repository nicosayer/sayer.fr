import { Button, Drawer, Input, Stack } from "@mantine/core";
import { IconDownload, IconEye } from "@tabler/icons";
import useDownloadDocument from "hooks/useDownloadDocument";
import usePreviewDocument from "hooks/usePreviewDocument";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBoard } from "../../Provider";

const Document: FC = () => {
  const { board, documents } = useBoard();
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [downloadDocument, loadingDownload] = useDownloadDocument();
  const [previewDocument, loadingPreview] = usePreviewDocument();

  const document = useMemo(() => {
    return documents?.find((document) => document.id === documentId);
  }, [documentId, documents]);

  if (!document) {
    return null;
  }

  return (
    <Drawer
      opened={Boolean(documentId)}
      onClose={() => navigate(`/boards/${board?.id}/documents`)}
      title="Document"
      padding="xl"
      position="right"
    >
      <Stack spacing="xl">
        <Stack spacing="xs">
          <Input.Wrapper label="Nom">
            <div>{document.name}</div>
          </Input.Wrapper>
        </Stack>
        <Stack spacing="xs">
          <Button
            variant="light"
            fullWidth
            loading={loadingPreview}
            color="blue"
            onClick={() => {
              previewDocument(document);
            }}
            leftIcon={<IconEye size={18} />}
          >
            Prévisualiser
          </Button>
          <Button
            variant="light"
            fullWidth
            loading={loadingDownload}
            color="blue"
            onClick={() => {
              downloadDocument(document);
            }}
            leftIcon={<IconDownload size={18} />}
          >
            Télécharger
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default Document;
