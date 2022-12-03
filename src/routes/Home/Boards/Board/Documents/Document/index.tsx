import { Button, Drawer, Input, Stack } from "@mantine/core";
import { IconDownload } from "@tabler/icons";
import { storage } from "configs/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import useBooleanState from "hooks/useBooleanState";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useDownloader from "react-use-downloader";
import { getExtension } from "utils/storage";
import { useBoard } from "../../Provider";

const Document: FC = () => {
  const { board, documents } = useBoard();
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [loadingDownload, startDownload, stopDownload] = useBooleanState();
  const { download } = useDownloader();

  const document = useMemo(() => {
    return documents?.find((document) => document.id === documentId);
  }, [documentId, documents]);

  if (!document) {
    return null;
  }

  return (
    <Drawer
      opened={Boolean(documentId)}
      onClose={() => navigate(`/boards/${board?.id}/documents`)}
      title="Document"
      padding="xl"
      position="right"
    >
      <Stack spacing="xl">
        <Input.Wrapper label="Type">
          <div>{document.type}</div>
        </Input.Wrapper>
        <Input.Wrapper label="Propriétaire">
          <div>{document.owner}</div>
        </Input.Wrapper>
        <Button
          variant="light"
          fullWidth
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
          leftIcon={<IconDownload size={18} />}
        >
          Télécharger
        </Button>
      </Stack>
    </Drawer>
  );
};

export default Document;
