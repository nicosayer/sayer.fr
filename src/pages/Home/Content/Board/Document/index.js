import { AnchorButton, Callout, H4, Icon, Intent } from "@blueprintjs/core";
import { Box } from "components/Box";
import { DeletePopover } from "components/DeletePopover";
import { Tooltip } from "components/Tooltip";
import { useDeleteFile } from "hooks/useDeleteFile";
import { useDownloadFile } from "hooks/useDownloadFile";
import { useEncryption } from "providers/EncryptionProvider";
import { useWindowSize } from "hooks/useWindowSize";
import { useToaster } from "providers/ToasterProvider";
import { EditDocumentButton } from "components/EditDocumentButton";

function Document({ document, isEditor }) {
  const { test, decrypt } = useEncryption();
  const { isOnMobile } = useWindowSize();
  const [downloadFile, loadingDowloadFile] = useDownloadFile();
  const [deleteFile] = useDeleteFile();
  const { successToast, dangerToast } = useToaster();

  if (!test(document.path)) {
    return null;
  }

  return (
    <>
      <H4>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
          }}
        >
          <Icon icon="id-number" color="lightgray" />
          <Box style={{ marginLeft: "10px" }}>{document.label}</Box>
          {isEditor && (
            <Box style={{ marginLeft: "10px" }}>
              <EditDocumentButton document={document} />
            </Box>
          )}
          {isEditor && (
            <Box style={{ marginLeft: "10px" }}>
              <DeletePopover
                src={document.ref}
                name="document"
                onSuccess={() => {
                  deleteFile({
                    ref: decrypt(document.path),
                  });
                }}
              >
                <Tooltip intent={Intent.DANGER} content="Remove document">
                  <AnchorButton intent={Intent.DANGER} minimal icon="trash" />
                </Tooltip>
              </DeletePopover>
            </Box>
          )}
        </Box>
      </H4>
      <Callout intent={Intent.PRIMARY} icon={null}>
        <Box style={{ textAlign: "center" }}>
          <Tooltip content="Download document">
            <AnchorButton
              loading={loadingDowloadFile}
              style={{ wordBreak: "break-word" }}
              fill={isOnMobile}
              rightIcon="import"
              onClick={() => {
                downloadFile({
                  ref: decrypt(document.path),
                  name: document.name,
                  onSuccess: () => {
                    successToast({
                      icon: "tick",
                      message: "Document downloaded",
                    });
                  },
                  onError: () => {
                    dangerToast({
                      icon: "warning-sign",
                      message: "The encryption key is incorrect",
                    });
                  },
                });
              }}
            >
              <Box style={{ fontFamily: "monospace" }}>{document.name}</Box>
            </AnchorButton>
          </Tooltip>
        </Box>
      </Callout>
    </>
  );
}

export default Document;
