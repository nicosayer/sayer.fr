import {
  Button,
  Callout,
  Classes,
  H4,
  H5,
  Intent,
  Popover,
  Toaster,
  Tooltip,
} from "@blueprintjs/core";
import { Box } from "components/Box";
import { useDeleteData } from "hooks/useDeleteData";
import { useIsMobile } from "hooks/useIsMobile";
import { useRef, useState } from "react";

function Credential({ credential }) {
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useIsMobile();
  const [deleteData, loading] = useDeleteData();
  const toaster = useRef();

  const copiedToClipboardToast = () => {
    toaster.current?.show({
      icon: "tick",
      intent: Intent.SUCCESS,
      message: "Copied to clipboard",
      timeout: 2000,
    });
  };

  return (
    <>
      <Box style={{ textAlign: "center" }}>
        <H4>
          {credential.label}
          {credential.url && (
            <Box as="span" style={{ marginLeft: "10px" }}>
              <a target="_blank" rel="noreferrer" href={credential.url}>
                <Tooltip content={credential.url}>
                  <Button minimal icon="share" />
                </Tooltip>
              </a>
            </Box>
          )}
          <Box as="span" style={{ marginLeft: "10px" }}>
            <Popover
              isOpen={isDeletePopoverOpen}
              onInteraction={setIsDeletePopoverOpen}
              content={
                <div key="text">
                  <H5>Confirm</H5>
                  <p>Are you sure you want to remove this item?</p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: 15,
                    }}
                  >
                    <Box style={{ marginRight: "10px" }}>
                      <Button onClick={() => setIsDeletePopoverOpen(false)}>
                        Cancel
                      </Button>
                    </Box>
                    <Button
                      intent={Intent.DANGER}
                      onClick={() => {
                        deleteData({
                          src: credential.ref,
                          callback: () => {
                            setIsDeletePopoverOpen(false);
                          },
                        });
                      }}
                      loading={loading}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              }
              popoverClassName={Classes.POPOVER_CONTENT_SIZING}
            >
              <Tooltip intent={Intent.DANGER} content="Remove item">
                <Button intent={Intent.DANGER} minimal icon="trash" />
              </Tooltip>
            </Popover>
          </Box>
        </H4>
      </Box>
      <Callout>
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gridGap: "10px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Tooltip content="Copy username to clipboard">
            <Button
              style={{ wordBreak: "break-word" }}
              fill={isMobile}
              rightIcon="duplicate"
              onClick={() => {
                navigator.clipboard.writeText(credential.username);
                copiedToClipboardToast();
              }}
            >
              <Box style={{ fontFamily: "monospace" }}>
                {credential.username}
              </Box>
            </Button>
          </Tooltip>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip content="Copy password to clipboard">
              <Button
                fill={isMobile}
                style={{ wordBreak: "break-word" }}
                rightIcon="duplicate"
                onClick={() => {
                  navigator.clipboard.writeText(credential.password);
                  copiedToClipboardToast();
                }}
              >
                <Box style={{ fontFamily: "monospace" }}>
                  {showPassword ? credential.password : "••••••••••"}
                </Box>
              </Button>
            </Tooltip>
            <Box as="span" style={{ marginLeft: "10px" }}>
              <Tooltip
                content={showPassword ? "Hide password" : "Show password"}
              >
                <Button
                  icon={showPassword ? "eye-off" : "eye-open"}
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                />
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Callout>
      <Toaster ref={toaster} maxToasts={1} />
    </>
  );
}

export default Credential;
