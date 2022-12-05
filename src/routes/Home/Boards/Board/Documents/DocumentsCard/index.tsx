import {
  ActionIcon,
  Button,
  Card,
  CopyButton,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { openConfirmModal, openModal } from "@mantine/modals";
import { IconCheck, IconEdit, IconLink, IconTrash } from "@tabler/icons";
import { storage } from "configs/firebase";
import { deleteDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { sortBy } from "lodash";
import { FC, useCallback, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { DocumentDocument } from "types/firebase/collections";
import { getExtension } from "utils/storage";
import { sanitize } from "utils/string";
import DownloadButton from "./Buttons/Download";
import PreviewButton from "./Buttons/Preview";
import EditDocumentModal from "./EditDocumentModal";

export interface DocumentsCardsProps {
  search: string;
}

const DocumentsCards: FC<DocumentsCardsProps> = ({ search }) => {
  const { board, documents } = useBoard();
  const is768Px = useMediaQuery("(min-width: 768px)");

  const openEditModal = useCallback((document: DocumentDocument) => {
    openModal({
      centered: true,
      title: "Modifier le document",
      children: <EditDocumentModal document={document} />,
    });
  }, []);

  const openDeleteModal = useCallback((document: DocumentDocument) => {
    openConfirmModal({
      title: "Supprimer le document",
      centered: true,
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
          console.log(document.ref.path);
          deleteDoc(document.ref);
          deleteObject(
            ref(
              storage,
              `${document.ref.path}/document.${getExtension(
                String(document.mime)
              )}`
            )
          );
        }
      },
    });
  }, []);

  const filteredDocuments = useMemo(() => {
    return sortBy(
      (documents ?? []).filter((document) => {
        return (
          sanitize(String(document.type)).indexOf(sanitize(search)) > -1 ||
          sanitize(String(document.owner)).indexOf(sanitize(search)) > -1
        );
      }),
      (document) => sanitize(document.type ?? "")
    );
  }, [documents, search]);

  return (
    <Stack>
      {filteredDocuments.map((document) => {
        return (
          <Card key={document.id} withBorder>
            <Stack>
              <Text fw={600} className="text-center">
                {document.type} - {document.owner}
              </Text>
              <Group grow>
                <PreviewButton document={document} />
                <DownloadButton document={document} />
              </Group>
              <Group grow>
                <CopyButton
                  value={`${process.env.REACT_APP_URL}/boards/${board?.id}/documents/${document.id}`}
                >
                  {({ copied, copy }) =>
                    is768Px ? (
                      <Button
                        variant="subtle"
                        color={copied ? "teal" : "blue"}
                        onClick={copy}
                        leftIcon={copied ? <IconCheck size={18} /> : <IconLink size={18} />}
                      >
                        {copied ? "Lien copié" : "Copier le lien"}
                      </Button>
                    ) : (
                      <Tooltip
                        label={copied ? "Lien copié" : "Copier le lien"}
                        withArrow
                      >
                        <ActionIcon
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
          </Card>
        );
      })}
    </Stack>
  );
};

export default DocumentsCards;
