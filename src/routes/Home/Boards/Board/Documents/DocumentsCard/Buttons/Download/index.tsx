import { ActionIcon, Button, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconDownload } from "@tabler/icons";
import useDownloadDocument from "hooks/useDownloadDocument";
import { FC } from "react";
import { DocumentDocument } from "types/firebase/collections";

export interface DownloadButtonProps {
  document: DocumentDocument;
}

const DownloadButton: FC<DownloadButtonProps> = ({ document }) => {
  const is768Px = useMediaQuery("(min-width: 768px)");
  const [downloadDocument, loadingDownload] = useDownloadDocument();

  if (is768Px) {
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
  }

  return (
    <Tooltip label="Télécharger" withArrow>
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
    </Tooltip>
  );
};

export default DownloadButton;
