import {
  AnchorButton,
  Button,
  Callout,
  Classes,
  H4,
  Intent,
  Popover,
  Toaster,
  Tooltip,
} from "@blueprintjs/core";
import { Box } from "components/Box";
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
  const toaster = useRef();

  const copiedToClipboardToast = () => {
    toaster.current?.show({
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

  const getViewPasswordTooltipContent = useMemo(() => {
    if (passwordIsCrypted) {
      return "Incorrect encryption key";
    }
    if (showPassword) {
      return "Hide password";
    }
    return "Show password";
  }, [passwordIsCrypted, showPassword]);

  return (
    <>
      <Box style={{ textAlign: "center" }}>
        <H4>
          {credential.label}
          {credential.url.startsWith("http") && (
            <Box as="span" style={{ marginLeft: "10px" }}>
              <a target="_blank" rel="noreferrer" href={credential.url}>
                <Tooltip content={credential.url} href={credential.url}>
                  <AnchorButton minimal icon="share" />
                </Tooltip>
              </a>
            </Box>
          )}
          <Box as="span" style={{ marginLeft: "10px" }}>
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
              <Tooltip
                intent={Intent.DANGER}
                content={
                  passwordIsCrypted ? "Incorrect encryption key" : "Remove item"
                }
              >
                <AnchorButton
                  disabled={passwordIsCrypted}
                  intent={Intent.DANGER}
                  minimal
                  icon="trash"
                />
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
          <Tooltip
            content="Copy username to clipboard"
            targetClassName={isMobile && "full-width"}
          >
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
            <Tooltip
              content={
                passwordIsCrypted
                  ? "Incorrect encryption key"
                  : "Copy password to clipboard"
              }
              className={isMobile && "full-width"}
              targetClassName={isMobile && "full-width"}
            >
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
              <Tooltip content={getViewPasswordTooltipContent}>
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
      <Toaster ref={toaster} maxToasts={1} />
    </>
  );
}

export default Credential;
