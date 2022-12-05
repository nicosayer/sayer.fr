import { ActionIcon } from "@mantine/core";
import { IconDownload } from "@tabler/icons";
import useDownloadDocument from "hooks/useDownloadDocument";
import { FC } from "react";
import { DocumentDocument } from "types/firebase/collections";

export interface DownloadButtonProps {
  document: DocumentDocument;
}

const DownloadButton: FC<DownloadButtonProps> = ({ document }) => {
  const [downloadDocument, loadingDownload] = useDownloadDocument();

  return (
    <ActionIcon
      loading={loadingDownload}
      variant="light"
      color="blue"
      onClick={() => {
        downloadDocument(document);
      }}
    >
      <IconDownload size={18} />
    </ActionIcon>
  );
};

export default DownloadButton;
