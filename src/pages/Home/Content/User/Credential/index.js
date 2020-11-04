import { Button, Callout, H4, Icon, Intent } from "@blueprintjs/core";
import { Box } from "components/Box";
import { DeletePopover } from "components/DeletePopover";
import { Tooltip } from "components/Tooltip";
import { useEncryption } from "providers/EncryptionProvider";
import { useIsMobile } from "hooks/useIsMobile";
import { useToaster } from "providers/ToasterProvider";
import { useMemo, useState } from "react";

function Credential({ credential }) {
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useIsMobile();
  const { decrypt, test } = useEncryption();
  const { success } = useToaster();

  const passwordIsCrypted = useMemo(() => {
    return !test(credential.password);
  }, [test, credential.password]);

  if (passwordIsCrypted) {
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
          <Icon icon="lock" color="lightgrey" />
          <Box style={{ marginLeft: "10px" }}>{credential.label}</Box>
          {credential.url.startsWith("http") && (
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
          <Box style={{ marginLeft: "10px" }}>
            <DeletePopover src={credential.ref} />
          </Box>
        </Box>
      </H4>
      <Callout intent={Intent.PRIMARY} icon={null}>
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gridGap: "10px",
            alignItems: "center",
          }}
        >
          <Box style={{ display: "flex", justifyContent: "flex-start" }}>
            <Tooltip content="Copy username to clipboard">
              <Button
                style={{ wordBreak: "break-word" }}
                fill={isMobile}
                rightIcon="duplicate"
                onClick={() => {
                  navigator.clipboard.writeText(credential.username);
                  success({
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
                fill={isMobile}
                style={{ wordBreak: "break-word" }}
                rightIcon="duplicate"
                onClick={() => {
                  navigator.clipboard.writeText(decrypt(credential.password));
                  success({
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
