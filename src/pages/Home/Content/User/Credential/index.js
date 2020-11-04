import {
  AnchorButton,
  Button,
  Callout,
  Classes,
  H4,
  Intent,
  Popover,
  Toaster,
} from "@blueprintjs/core";
import { Box } from "components/Box";
import { Tooltip } from "components/Tooltip";
import { useDeleteData } from "hooks/useDeleteData";
import { useEncryption } from "hooks/useEncryption";
import { useIsMobile } from "hooks/useIsMobile";
import { useEffect, useMemo, useRef, useState } from "react";

function Credential({ credential }) {
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useIsMobile();
  const [deleteData, loading] = useDeleteData();
  const { decrypt, test } = useEncryption();
  const toasterRef = useRef();

  const copiedToClipboardToast = () => {
    toasterRef.current?.show({
      icon: "tick",
      intent: Intent.SUCCESS,
      message: "Copied to clipboard",
      timeout: 2000,
    });
  };

  const passwordIsCrypted = useMemo(() => {
    return !test(credential.password);
  }, [test, credential.password]);

  useEffect(() => {
    if (passwordIsCrypted) {
      setShowPassword(false);
      setIsDeletePopoverOpen(false);
    }
  }, [passwordIsCrypted]);

  return (
    <>
      <H4>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: passwordIsCrypted ? "lightgrey" : "black",
          }}
        >
          {credential.label}
          {credential.url.startsWith("http") && (
            <Box style={{ marginLeft: "10px" }}>
              <Box
                as={passwordIsCrypted ? undefined : "a"}
                target="_blank"
                rel="noreferrer"
                href={credential.url}
              >
                <Tooltip content={credential.url} href={credential.url}>
                  <AnchorButton
                    disabled={passwordIsCrypted}
                    minimal
                    icon="share"
                  />
                </Tooltip>
              </Box>
            </Box>
          )}
          <Box style={{ marginLeft: "10px" }}>
            <Popover
              disabled={passwordIsCrypted}
              isOpen={isDeletePopoverOpen}
              onInteraction={setIsDeletePopoverOpen}
              content={
                <>
                  <p>Are you sure you want to delete this item?</p>
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
                </>
              }
              popoverClassName={Classes.POPOVER_CONTENT_SIZING}
            >
              <Tooltip intent={Intent.DANGER} content="Remove item">
                <AnchorButton
                  disabled={passwordIsCrypted}
                  intent={Intent.DANGER}
                  minimal
                  icon="trash"
                />
              </Tooltip>
            </Popover>
          </Box>
        </Box>
      </H4>
      <Callout
        intent={passwordIsCrypted ? undefined : Intent.PRIMARY}
        icon={null}
      >
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gridGap: "10px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box style={{ display: "flex", justifyContent: "flex-start" }}>
            <Tooltip content="Copy username to clipboard">
              <AnchorButton
                disabled={passwordIsCrypted}
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
              </AnchorButton>
            </Tooltip>
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip content="Copy password to clipboard">
              <AnchorButton
                fill={isMobile}
                style={{ wordBreak: "break-word" }}
                rightIcon="duplicate"
                onClick={() => {
                  navigator.clipboard.writeText(decrypt(credential.password));
                  copiedToClipboardToast();
                }}
                disabled={passwordIsCrypted}
              >
                <Box style={{ fontFamily: "monospace" }}>
                  {showPassword ? decrypt(credential.password) : "••••••••••"}
                </Box>
              </AnchorButton>
            </Tooltip>
            <Box style={{ marginLeft: "10px" }}>
              <Tooltip
                content={showPassword ? "Hide password" : "Show password"}
              >
                <AnchorButton
                  icon={showPassword ? "eye-off" : "eye-open"}
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  disabled={passwordIsCrypted}
                />
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Callout>
      <Toaster ref={toasterRef} maxToasts={1} />
    </>
  );
}

export default Credential;
