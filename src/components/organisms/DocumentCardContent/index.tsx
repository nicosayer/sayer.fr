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
import { DocumentDocument, Mime } from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import { storage } from "utils/firebase";
import { getExtension } from "utils/storage";
import EditDocumentModal from "./EditDocumentModal";

export interface DocumentCardsPropContent {
  document: DocumentDocument;
}

const DocumentCardContent: FC<DocumentCardsPropContent> = ({ document }) => {
  const { boards } = useBoard();
  const is768Px = useMediaQuery("(min-width: 768px)");
  const [previewDocument, loadingPreview] = usePreviewDocument();
  const [downloadDocument, loadingDownload] = useDownloadDocument();

  const openEditModal = useCallback(
    (document: DocumentDocument) => {
      if (boards) {
        openModal({
          centered: true,
          zIndex: 1000,
          title: "Modifier le document",
          children: <EditDocumentModal document={document} boards={boards} />,
        });
      }
    },
    [boards]
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
                document.mime as Mime
              )}`
            )
          );
        }
      },
    });
  }, []);

  const MimeIcon = useMemo(() => {
    switch (document?.mime) {
      case Mime.Jpeg:
      case Mime.Png:
        return IconPhoto;
      case Mime.Pdf:
      default:
        return IconFileText;
    }
  }, [document?.mime]);

  return (
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
      <Group grow>
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
                  size="xs"
                  color={copied ? "teal" : "blue"}
                  onClick={copy}
                >
                  {copied ? <IconCheck size={18} /> : <IconLink size={18} />}
                </ActionIcon>
              </Tooltip>
            )
          }
        </CopyButton>
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
              size="xs"
              color="blue"
              onClick={() => {
                openEditModal(document);
              }}
            >
              <IconEdit size={18} />
            </ActionIcon>
          </Tooltip>
        )}
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
              size="xs"
              color="red"
              onClick={() => {
                openDeleteModal(document);
              }}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Stack>
  );
};

export default DocumentCardContent;
