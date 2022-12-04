import { Button, Tooltip } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons";
import { FC } from "react";
import { CredentialDocument } from "types/firebase/collections";

interface CredentialNameCopyButtonProps {
  credential: CredentialDocument;
}

const CredentialNameCopyButton: FC<CredentialNameCopyButtonProps> = ({
  credential,
}) => {
  return (
    <Tooltip label="Aller sur le site" withArrow>
      <Button
        variant="subtle"
        compact
        size="md"
        color="dark"
        rightIcon={<IconExternalLink size={18} />}
        component="a"
        target="_blank"
        rel="noopener noreferrer"
        href={
          credential?.url ||
          `https://www.google.com/search?q=${credential.name}`
        }
        className="max-w-[200px]"
      >
        {credential?.name}
      </Button>
    </Tooltip>
  );
};

export default CredentialNameCopyButton;
