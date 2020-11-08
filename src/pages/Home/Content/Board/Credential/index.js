import {
  AnchorButton,
  Button,
  Callout,
  H4,
  Icon,
  Intent,
} from "@blueprintjs/core";
import { Box } from "components/Box";
import { DeletePopover } from "components/DeletePopover";
import { Tooltip } from "components/Tooltip";
import { useEncryption } from "providers/EncryptionProvider";
import { useWindowSize } from "hooks/useWindowSize";
import { useToaster } from "providers/ToasterProvider";
import { useState } from "react";
import { EditCredentialButton } from "components/EditCredentialButton";

function Credential({ credential, isEditor }) {
  const [showPassword, setShowPassword] = useState(false);
  const { isOnMobile } = useWindowSize();
  const { decrypt, test } = useEncryption();
  const { successToast } = useToaster();

  if (!test(credential.password)) {
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
          <Icon icon="lock" color="lightgray" />
          <Box style={{ marginLeft: "10px" }}>{credential.label}</Box>
          {credential.url?.startsWith("http") && (
            <Box style={{ marginLeft: "10px" }}>
              <Box
                as="a"
                target="_blank"
                rel="noreferrer"
                href={credential.url}
              >
                <Tooltip content={credential.url} href={credential.url}>
                  <Button minimal icon="share" />
                </Tooltip>
              </Box>
            </Box>
          )}
          {isEditor && (
            <Box style={{ marginLeft: "10px" }}>
              <EditCredentialButton credential={credential} />
            </Box>
          )}
          {isEditor && (
            <Box style={{ marginLeft: "10px" }}>
              <DeletePopover src={credential.ref} name="credential">
                <Tooltip intent={Intent.DANGER} content="Remove credential">
                  <AnchorButton intent={Intent.DANGER} minimal icon="trash" />
                </Tooltip>
              </DeletePopover>
            </Box>
          )}
        </Box>
      </H4>
      <Callout intent={Intent.PRIMARY} icon={null}>
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: isOnMobile ? "1fr" : "1fr 1fr",
            gridGap: "10px",
            alignItems: "center",
          }}
        >
          <Box style={{ display: "flex", justifyContent: "flex-start" }}>
            <Tooltip content="Copy username to clipboard">
              <Button
                style={{ wordBreak: "break-word" }}
                fill={isOnMobile}
                rightIcon="duplicate"
                onClick={() => {
                  navigator.clipboard.writeText(credential.username);
                  successToast({
                    icon: "tick",
                    message: "Username copied to clipboard",
                  });
                }}
              >
                <Box style={{ fontFamily: "monospace" }}>
                  {credential.username}
                </Box>
              </Button>
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
              <Button
                fill={isOnMobile}
                style={{ wordBreak: "break-word" }}
                rightIcon="duplicate"
                onClick={() => {
                  navigator.clipboard.writeText(decrypt(credential.password));
                  successToast({
                    icon: "tick",
                    message: "Password copied to clipboard",
                  });
                }}
              >
                <Box style={{ fontFamily: "monospace" }}>
                  {showPassword ? decrypt(credential.password) : "••••••••••"}
                </Box>
              </Button>
            </Tooltip>
            <Box style={{ marginLeft: "10px" }}>
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
    </>
  );
}

export default Credential;
