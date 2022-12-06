import { Button } from "@mantine/core";
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
  );
};

export default PreviewButton;
