import { Button } from "@mantine/core";
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
  );
};

export default DownloadButton;
