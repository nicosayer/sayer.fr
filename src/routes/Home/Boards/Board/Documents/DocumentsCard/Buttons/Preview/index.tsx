import { ActionIcon, Button, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconEye } from "@tabler/icons";
import usePreviewDocument from "hooks/usePreviewDocument";
import { FC } from "react";
import { DocumentDocument } from "types/firebase/collections";

export interface PreviewButtonProps {
  document: DocumentDocument;
}

const PreviewButton: FC<PreviewButtonProps> = ({ document }) => {
  const is768Px = useMediaQuery("(min-width: 768px)");
  const [previewDocument, loadingPreview] = usePreviewDocument();

  if (is768Px) {
    return (
      <Button
        variant="subtle"
        loading={loadingPreview}
        onClick={() => {
          previewDocument(document);
        }}
        leftIcon={<IconEye size={18} />}
      >
        Prévisualiser
      </Button>
    );
  }

  return (
    <Tooltip label="Prévisualiser" withArrow>
      <ActionIcon
        loading={loadingPreview}
        color="blue"
        onClick={() => {
          previewDocument(document);
        }}
      >
        <IconEye size={18} />
      </ActionIcon>
    </Tooltip>
  );
};

export default PreviewButton;
