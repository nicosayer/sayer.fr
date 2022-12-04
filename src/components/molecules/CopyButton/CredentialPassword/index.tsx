import { Button, CopyButton, Tooltip } from "@mantine/core";
import { IconCopy } from "@tabler/icons";
import { FC } from "react";
import { CredentialDocument } from "types/firebase/collections";

interface CredentialPasswordCopyButtonProps {
  credential: CredentialDocument;
}

const CredentialPasswordCopyButton: FC<CredentialPasswordCopyButtonProps> = ({
  credential,
}) => {
  return (
    <CopyButton value={String(credential?.password)}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? "Copié" : "Copier"} withArrow>
          <Button
            variant="subtle"
            compact
            size="md"
            color={copied ? "teal" : "dark"}
            onClick={copy}
            rightIcon={<IconCopy size={18} />}
          >
            ••••••••••
          </Button>
        </Tooltip>
      )}
    </CopyButton>
  );
};

export default CredentialPasswordCopyButton;
