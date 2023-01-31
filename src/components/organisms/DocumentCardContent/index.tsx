import {
  ActionIcon,
  Badge,
  Button,
  CopyButton,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { openConfirmModal, openModal } from "@mantine/modals";
import {
  IconCheck,
  IconDownload,
  IconEdit,
  IconEye,
  IconFileText,
  IconLink,
  IconPhoto,
  IconTrash,
} from "@tabler/icons";
import { deleteDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import useDownloadDocument from "hooks/useDownloadDocument";
import usePreviewDocument from "hooks/usePreviewDocument";
import { FC, useCallback, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { DocumentDocument, DocumentMime } from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import { storage } from "utils/firebase";
import { getExtension } from "utils/storage";
import EditDocumentModal from "./EditDocumentModal";

export interface DocumentCardsPropContent {
  document: DocumentDocument;
}

const DocumentCardContent: FC<DocumentCardsPropContent> = ({ document }) => {
  const is768Px = useMediaQuery("(min-width: 768px)", true);
  const [previewDocument, loadingPreview] = usePreviewDocument();
  const [downloadDocument, loadingDownload] = useDownloadDocument();
  const { boards } = useBoard();

  const board = useMemo(() => {
    return boards?.find(
      (board) => board.id === document.ref?.parent.parent?.id
    );
  }, [boards, document.ref?.parent.parent?.id]);

  const openEditModal = useCallback(
    (document: DocumentDocument) => {
      if (board) {
        openModal({
          centered: true,
          zIndex: 1000,
          title: "Modifier le document",
          children: <EditDocumentModal document={document} board={board} />,
        });
      }
    },
    [board]
  );

  const openDeleteModal = useCallback((document: DocumentDocument) => {
    openConfirmModal({
      title: "Supprimer le document",
      centered: true,
      zIndex: 1000,
      children: (
        <Text size="sm">
          Voulez-vous vraiment supprimer le document ? Cette action est
          définitive et irréversible.
        </Text>
      ),
      labels: { confirm: "Supprimer", cancel: "Annuler" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (document.ref) {
          deleteDoc(document.ref);
          deleteObject(
            ref(
              storage,
              `${document.ref.path}/document.${getExtension(
                document.mime as DocumentMime
              )}`
            )
          );
        }
      },
    });
  }, []);

  const MimeIcon = useMemo(() => {
    switch (document?.mime) {
      case DocumentMime.Jpeg:
      case DocumentMime.Png:
        return IconPhoto;
      case DocumentMime.Pdf:
      default:
        return IconFileText;
    }
  }, [document?.mime]);

  return (
    <Stack>
      <Text fw={600} className="text-center">
        {document.name}
        {document.tag && is768Px && (
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
          {getExtension(document.mime as DocumentMime)}
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
      <div className="grid grid-cols-3">
        <div className="m-auto">
          <CopyButton value={`${window.location.host}/${document.ref?.path}`}>
            {({ copied, copy }) =>
              is768Px ? (
                <Button
                  variant="subtle"
                  size="xs"
                  color={copied ? "teal" : "blue"}
                  onClick={copy}
                  leftIcon={
                    copied ? <IconCheck size={18} /> : <IconLink size={18} />
                  }
                >
                  {copied ? "Lien copié" : "Copier le lien"}
                </Button>
              ) : (
                <Tooltip
                  label={copied ? "Lien copié" : "Copier le lien"}
                  withArrow
                >
                  <ActionIcon
                    className="m-auto"
                    color={copied ? "teal" : "blue"}
                    onClick={copy}
                  >
                    {copied ? <IconCheck size={18} /> : <IconLink size={18} />}
                  </ActionIcon>
                </Tooltip>
              )
            }
          </CopyButton>
        </div>
        <div className="m-auto">
          {is768Px ? (
            <Button
              size="xs"
              variant="subtle"
              onClick={() => {
                openEditModal(document);
              }}
              leftIcon={<IconEdit size={18} />}
            >
              Modifier
            </Button>
          ) : (
            <Tooltip label="Modifier" withArrow>
              <ActionIcon
                className="m-auto"
                color="blue"
                onClick={() => {
                  openEditModal(document);
                }}
              >
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </div>
        <div className="m-auto">
          {is768Px ? (
            <Button
              size="xs"
              color="red"
              variant="subtle"
              onClick={() => {
                openDeleteModal(document);
              }}
              leftIcon={<IconTrash size={18} />}
            >
              Supprimer
            </Button>
          ) : (
            <Tooltip label="Supprimer" withArrow>
              <ActionIcon
                className="m-auto"
                color="red"
                onClick={() => {
                  openDeleteModal(document);
                }}
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </div>
      </div>
    </Stack>
  );
};

export default DocumentCardContent;
