import {
  ActionIcon,
  Badge,
  Button,
  Card,
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
  IconEdit,
  IconFileText,
  IconLink,
  IconPhoto,
  IconTrash,
} from "@tabler/icons";
import { storage } from "configs/firebase";
import { deleteDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { sortBy } from "lodash";
import { FC, useCallback, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { DocumentDocument, Mime } from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import { getExtension } from "utils/storage";
import { sanitize, searchString } from "utils/string";
import DownloadButton from "./Buttons/Download";
import PreviewButton from "./Buttons/Preview";
import EditDocumentModal from "./EditDocumentModal";

export interface DocumentsCardsProps {
  search: string;
}

const DocumentsCards: FC<DocumentsCardsProps> = ({ search }) => {
  const { board, documents } = useBoard();
  const is768Px = useMediaQuery("(min-width: 768px)");

  const openEditModal = useCallback(
    (document: DocumentDocument) => {
      if (board) {
        openModal({
          centered: true,
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

  const filteredDocuments = useMemo(() => {
    return sortBy(
      (documents ?? []).filter((document) => {
        return searchString(`${document.name}${document.tag}`, search);
      }),
      (document) => sanitize(`${document.name}${document.tag}`)
    );
  }, [documents, search]);

  return (
    <Stack>
      {filteredDocuments.map((document) => {
        const MimeIcon = {
          [Mime.Jpeg]: IconPhoto,
          [Mime.Png]: IconPhoto,
          [Mime.Pdf]: IconFileText,
        }[document.mime ?? Mime.Pdf];
        return (
          <Card key={document.id} withBorder>
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
                        size="xs"
                        color={copied ? "teal" : "blue"}
                        onClick={copy}
                        leftIcon={
                          copied ? (
                            <IconCheck size={18} />
                          ) : (
                            <IconLink size={18} />
                          )
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
                          {copied ? (
                            <IconCheck size={18} />
                          ) : (
                            <IconLink size={18} />
                          )}
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
          </Card>
        );
      })}
    </Stack>
  );
};

export default DocumentsCards;
