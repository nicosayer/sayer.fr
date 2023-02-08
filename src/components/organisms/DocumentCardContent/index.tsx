import {
  ActionIcon,
  Badge,
  Button,
  CopyButton,
  Group,
  Menu,
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
} from "@tabler/icons";
import { deleteDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import useDownloadDocument from "hooks/useDownloadDocument";
import useGetTags from "hooks/useGetTags";
import usePreviewDocument from "hooks/usePreviewDocument";
import { FC, useCallback, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { DocumentDocument, DocumentMime } from "types/firebase/collections";
import { storage } from "utils/firebase";
import { getExtension } from "utils/storage";
import EditDocumentModal from "./EditDocumentModal";
import MoveDocumentModal from "./MoveDocumenModal";

export interface DocumentCardsPropContent {
  document: DocumentDocument;
}

const DocumentCardContent: FC<DocumentCardsPropContent> = ({ document }) => {
  const [previewDocument, loadingPreview] = usePreviewDocument();
  const [downloadDocument, loadingDownload] = useDownloadDocument();
  const { boards } = useBoard();
  const getTags = useGetTags();

  const tags = useMemo(() => {
    return getTags(document.tags);
  }, [document.tags, getTags]);

  const openEditModal = useCallback((document: DocumentDocument) => {
    openModal({
      centered: true,
      zIndex: 1000,
      title: "Modifier le document",
      children: <EditDocumentModal document={document} />,
    });
  }, []);

  const openMoveModal = useCallback((document: DocumentDocument) => {
    return openModal({
      centered: true,
      zIndex: 1000,
      title: "Déplacer le document",
      children: <MoveDocumentModal document={document} />,
    });
  }, []);

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

  return (
    <Stack align="center">
      <Group spacing="xs">
        <Text weight={500}>{document.name}</Text>
        <Badge radius="sm" color="gray">
          {getExtension(document.mime as DocumentMime)}
        </Badge>
      </Group>
      {tags.length ? (
        <Group>
          {tags.map((tag) => (
            <Badge variant="dot" color={tag.color} size="sm">
              {tag.name}
            </Badge>
          ))}
        </Group>
      ) : undefined}
      <Group className="w-full">
        <Button
          variant="light"
          className="flex-1"
          onClick={() => {
            previewDocument(document);
          }}
          loading={loadingPreview}
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
                    Déplacer
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
