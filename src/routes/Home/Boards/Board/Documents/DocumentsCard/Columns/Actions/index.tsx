import { ActionIcon, CopyButton, Group, Text, Tooltip } from "@mantine/core";
import { openConfirmModal, openModal } from "@mantine/modals";
import {
  IconDownload,
  IconEdit,
  IconEye,
  IconLink,
  IconTrash,
} from "@tabler/icons";
import { storage } from "configs/firebase";
import { deleteDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
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
  const [loadingPreview, startPreview, stopPreview] = useBooleanState();
  const [loadingDownload, startDownload, stopDownload] = useBooleanState();

  return (
    <td>
      <Group position="right">
        <ActionIcon
          loading={loadingPreview}
          color="blue"
          onClick={async () => {
            startPreview();
            getDownloadURL(
              ref(
                storage,
                `boards/${board?.id}/documents/${
                  document.id
                }/document.${getExtension(String(document.mime))}`
              )
            )
              .then((url) => {
                openModal({
                  centered: true,
                  children: (
                    <iframe
                      title="Document"
                      src={url}
                      className="w-full h-[80vh] border-0"
                    />
                  ),
                  size: "xl",
                  withCloseButton: false,
                  padding: 0,
                  classNames: { modal: "overflow-hidden" },
                });
              })
              .finally(stopPreview);
          }}
        >
          <IconEye size={18} />
        </ActionIcon>
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
        <CopyButton
          value={`${process.env.REACT_APP_URL}/boards/${board?.id}/documents/${document.id}`}
        >
          {({ copied, copy }) => (
            <Tooltip label={copied ? "Lien copié" : "Copier le lien"} withArrow>
              <ActionIcon
                variant="subtle"
                color={copied ? "teal" : "blue"}
                onClick={copy}
              >
                <IconLink size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
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
                    est définitive et irréversible.
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
                        `boards/${board?.id}/documents/${
                          document.id
                        }/document.${getExtension(String(document.mime))}`
                      )
                    );
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
