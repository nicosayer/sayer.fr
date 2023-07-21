import {
  ActionIcon,
  Badge,
  Button,
  CopyButton,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { openConfirmModal, openModal } from "@mantine/modals";
import {
  IconCheck,
  IconDotsVertical,
  IconEdit,
  IconLink,
  IconSwitchHorizontal,
  IconTrash,
} from "@tabler/icons-react";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import EditDocumentModalContent from "components/organisms/DocumentCardContent/EditDocumentModalContent";
import MoveDocumentModalContent from "components/organisms/DocumentCardContent/MoveDocumentModalContent";
import { deleteDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import useDownloadDocument from "hooks/useDownloadDocument";
import usePreviewDocument from "hooks/usePreviewDocument";
import { FC } from "react";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { DocumentDocument, DocumentMime } from "types/firebase/collections";
import { storage } from "utils/firebase";
import { getExtension } from "utils/storage";

export interface DocumentCardsPropContent {
  document: DocumentDocument;
}

const openEditModal = (document: DocumentDocument) => {
  openModal({
    centered: true,
    title: "Modifier le document",
    children: <EditDocumentModalContent document={document} />,
  });
};

const openMoveModal = (document: DocumentDocument) => {
  openModal({
    centered: true,
    title: "Déplacer le document",
    children: <MoveDocumentModalContent document={document} />,
  });
};

const openDeleteModal = (document: DocumentDocument) => {
  openConfirmModal({
    title: "Supprimer le document",
    centered: true,
    children: (
      <Text size="sm">
        Voulez-vous vraiment supprimer ce document ? Cette action est définitive
        et irréversible.
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
};

const DocumentCardContent: FC<DocumentCardsPropContent> = ({ document }) => {
  const [previewButtonDocument, loadingPreviewButton] = usePreviewDocument();
  const [downloadDocument, loadingDownload] = useDownloadDocument();
  const [previewThumbnailDocument, loadingPreviewThumbnail] =
    usePreviewDocument();
  const [downloadUrl, loading] = useDownloadURL(
    ref(
      storage,
      `${document?.ref?.path}/document.${getExtension(
        document.mime as DocumentMime
      )}`
    )
  );

  const { boards } = useBoard();

  return (
    <Stack align="center">
      <Group spacing="xs">
        <Text weight={500}>{document.name}</Text>
        <Badge radius="sm" color="gray">
          {getExtension(document.mime as DocumentMime)}
        </Badge>
      </Group>
      <Paper
        shadow="xs"
        p="xs"
        withBorder
        onClick={() => {
          previewThumbnailDocument(document);
        }}
        className="cursor-pointer"
      >
        <LoadingOverlay visible={loading || loadingPreviewThumbnail} />
        <iframe
          title="Thumbnail"
          src={downloadUrl}
          style={{ border: "none", pointerEvents: "none" }}
        />
      </Paper>
      <Group className="w-full">
        <Button
          variant="light"
          className="flex-1"
          onClick={() => {
            previewButtonDocument(document);
          }}
          loading={loadingPreviewButton}
        >
          Prévisualiser
        </Button>
        <Button
          variant="light"
          className="flex-1"
          onClick={() => {
            downloadDocument(document);
          }}
          loading={loadingDownload}
        >
          Télécharger
        </Button>
        <CopyButton value={`${window.location.host}/${document.ref?.path}`}>
          {({ copied, copy }) => (
            <Menu shadow="md" width={200} withinPortal>
              <Menu.Target>
                <ActionIcon
                  variant="light"
                  radius="md"
                  size={36}
                  color={copied ? "teal" : undefined}
                >
                  {copied ? (
                    <IconCheck size={18} />
                  ) : (
                    <IconDotsVertical size={18} />
                  )}
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item icon={<IconLink size={18} />} onClick={copy}>
                  Copier le lien
                </Menu.Item>
                {(boards?.length ?? 0) > 1 ? (
                  <Menu.Item
                    onClick={() => {
                      openMoveModal(document);
                    }}
                    icon={<IconSwitchHorizontal size={18} />}
                  >
                    Déplacer de board
                  </Menu.Item>
                ) : undefined}
                <Menu.Item
                  onClick={() => {
                    openEditModal(document);
                  }}
                  icon={<IconEdit size={18} />}
                >
                  Modifier
                </Menu.Item>
                <Menu.Item
                  color="red"
                  onClick={() => {
                    openDeleteModal(document);
                  }}
                  icon={<IconTrash size={18} />}
                >
                  Supprimer
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </CopyButton>
      </Group>
    </Stack>
  );
};

export default DocumentCardContent;
