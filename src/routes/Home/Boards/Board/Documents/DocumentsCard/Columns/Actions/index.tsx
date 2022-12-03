import { ActionIcon, Group, Text, Tooltip } from "@mantine/core";
import { openConfirmModal, openModal } from "@mantine/modals";
import { IconDownload, IconEdit, IconTrash } from "@tabler/icons";
import { storage } from "configs/firebase";
import { deleteDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import useDownloader from "react-use-downloader";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { DocumentDocument } from "types/firebase/collections";
import { getExtension } from "utils/storage";
import EditDocumentModal from "./EditDocumentModal";

export interface ActionsColumnsProps {
  document: DocumentDocument;
}

const ActionsColumns: FC<ActionsColumnsProps> = ({ document }) => {
  const { board } = useBoard();
  const { download } = useDownloader();
  const [loadingDownload, startDownload, stopDownload] = useBooleanState();

  return (
    <td>
      <Group position="right">
        <Tooltip label="Télécharger">
          <ActionIcon
            loading={loadingDownload}
            color="blue"
            onClick={async () => {
              startDownload();
              getDownloadURL(
                ref(
                  storage,
                  `boards/${board?.id}/documents/${
                    document.id
                  }/document.${getExtension(String(document.mime))}`
                )
              )
                .then((url) => {
                  return download(
                    url,
                    `${document.type} - ${document.owner}.${getExtension(
                      String(document.mime)
                    )}`
                  );
                })
                .finally(stopDownload);
            }}
          >
            <IconDownload size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Modifier" withArrow>
          <ActionIcon
            color="blue"
            variant="subtle"
            onClick={() => {
              openModal({
                centered: true,
                title: "Modifier le document",
                children: <EditDocumentModal document={document} />,
              });
            }}
          >
            <IconEdit size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Supprimer" withArrow>
          <ActionIcon
            color="red"
            variant="subtle"
            onClick={() => {
              openConfirmModal({
                title: "Supprimer le document",
                centered: true,
                children: (
                  <Text size="sm">
                    Voulez-vous vraiment supprimer le document ? Cette action
                    est définitive et irrémédiable.
                  </Text>
                ),
                labels: { confirm: "Supprimer", cancel: "Annuler" },
                confirmProps: { color: "red" },
                onConfirm: () => {
                  if (document.ref) {
                    deleteDoc(document.ref);
                  }
                },
              });
            }}
          >
            <IconTrash size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </td>
  );
};

export default ActionsColumns;
