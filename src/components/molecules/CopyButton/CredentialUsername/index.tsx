import { Button, CopyButton, Tooltip } from "@mantine/core";
import { IconCopy } from "@tabler/icons";
import { FC } from "react";
import { CredentialDocument } from "types/firebase/collections";

interface CredentialUsernameCopyButtonProps {
  credential: CredentialDocument;
}

const CredentialUsernameCopyButton: FC<CredentialUsernameCopyButtonProps> = ({
  credential,
}) => {
  return (
    <CopyButton value={String(credential?.username)}>
      {({ copied, copy }) => (
        <Tooltip
          label={
            copied ? "Nom d'utilisateur copié" : "Copier le nom d'utilisateur"
          }
          withArrow
        >
          <Button
            variant="subtle"
            compact
            color={copied ? "teal" : "gray"}
            onClick={copy}
            rightIcon={<IconCopy size={18} />}
            className="max-w-[200px]"
          >
            {credential?.username}
          </Button>
        </Tooltip>
      )}
    </CopyButton>
  );
};

export default CredentialUsernameCopyButton;
