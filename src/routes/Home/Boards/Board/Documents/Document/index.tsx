import {
  Badge,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconDownload, IconEye, IconFileText, IconPhoto } from "@tabler/icons";
import useDownloadDocument from "hooks/useDownloadDocument";
import usePreviewDocument from "hooks/usePreviewDocument";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mime } from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import { getExtension } from "utils/storage";
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

  const MimeIcon = useMemo(() => {
    switch (document?.mime) {
      case Mime.Jpeg:
      case Mime.Png:
        return IconPhoto;
      case Mime.Pdf:
        return IconFileText;
    }
  }, [document?.mime]);

  if (!document || !MimeIcon) {
    return null;
  }

  return (
    <Modal
      opened={Boolean(documentId)}
      onClose={() => navigate(`/boards/${board?.id}/documents`)}
      centered
      withCloseButton={false}
      trapFocus={false}
    >
      <Stack>
        <Text fw={600} className="text-center">
          {document.name}
          {document.tag && (
            <Badge
              variant="dot"
              color={getColorFromString(document.tag)}
              className="absolute right-[16px]"
            >
              {document.tag}
            </Badge>
          )}
        </Text>
        <Group position="center" spacing="xs">
          <ThemeIcon variant="light" color="gray">
            <MimeIcon size={18} />
          </ThemeIcon>
          <Badge size="lg" radius="sm" color="gray">
            {getExtension(document.mime as Mime)}
          </Badge>
        </Group>
        <Group grow>
          <Button
            loading={loadingPreview}
            variant="light"
            onClick={() => {
              previewDocument(document);
            }}
            leftIcon={<IconEye size={18} />}
          >
            Prévisualiser
          </Button>
          <Button
            loading={loadingDownload}
            variant="light"
            onClick={() => {
              downloadDocument(document);
            }}
            leftIcon={<IconDownload size={18} />}
          >
            Télécharger
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default Document;
