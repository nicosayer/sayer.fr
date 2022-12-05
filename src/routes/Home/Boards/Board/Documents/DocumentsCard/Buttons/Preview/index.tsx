import { ActionIcon } from "@mantine/core";
import { IconEye } from "@tabler/icons";
import usePreviewDocument from "hooks/usePreviewDocument";
import { FC } from "react";
import { DocumentDocument } from "types/firebase/collections";

export interface PreviewButtonProps {
  document: DocumentDocument;
}

const PreviewButton: FC<PreviewButtonProps> = ({ document }) => {
  const [previewDocument, loadingPreview] = usePreviewDocument();

  return (
    <ActionIcon
      loading={loadingPreview}
      variant="light"
      color="blue"
      onClick={() => {
        previewDocument(document);
      }}
    >
      <IconEye size={18} />
    </ActionIcon>
  );
};

export default PreviewButton;
