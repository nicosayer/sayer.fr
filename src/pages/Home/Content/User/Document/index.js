import {
  AnchorButton,
  Callout,
  H4,
  Icon,
  Intent,
  Toaster,
} from "@blueprintjs/core";
import { Box } from "components/Box";
import { DeletePopover } from "components/DeletePopover";
import { Tooltip } from "components/Tooltip";
import { useDeleteFile } from "hooks/useDeleteFile";
import { useDownloadFile } from "hooks/useDownloadFile";
import { useEncryption } from "providers/EncryptionProvider";
import { useIsMobile } from "hooks/useIsMobile";
import { useToaster } from "providers/ToasterProvider";
import { useRef } from "react";

function Document({ document }) {
  const { test, decrypt } = useEncryption();
  const toasterRef = useRef();
  const isMobile = useIsMobile();
  const [downloadFile, loadingDowloadFile] = useDownloadFile();
  const [deleteFile] = useDeleteFile();
  const { success,danger } = useToaster();

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
          <Icon icon="id-number" color="lightgrey" />
          <Box style={{ marginLeft: "10px", marginRight: "10px" }}>
            {document.label}
          </Box>
          <DeletePopover
            src={document.ref}
            onSuccess={() => {
              deleteFile({
                ref: decrypt(document.path),
              });
            }}
          />
        </Box>
      </H4>
      <Callout intent={Intent.PRIMARY} icon={null}>
        <Box style={{ textAlign: "center" }}>
          <Tooltip content="Download document">
            <AnchorButton
              loading={loadingDowloadFile}
              style={{ wordBreak: "break-word" }}
              fill={isMobile}
              rightIcon="import"
              onClick={() => {
                downloadFile({
                  ref: decrypt(document.path),
                  name: document.name,
                  onSuccess: () => {
                    success({
                      icon: "tick",
                      message: "Document downloaded",
                    });
                  },
                  onError: () => {
                    danger({
                      icon: "warning-sign",
                      message: "Error: The encryption key is incorrect",
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
      <Toaster ref={toasterRef} maxToasts={1} />
    </>
  );
}

export default Document;
