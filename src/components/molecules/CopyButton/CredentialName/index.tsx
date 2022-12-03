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
  if (credential?.url) {
    return (
      <Tooltip label="Aller sur le site" withArrow>
        <Button
          variant="subtle"
          compact
          color="dark"
          rightIcon={
            credential?.url ? <IconExternalLink size={18} /> : undefined
          }
          component="a"
          target="_blank"
          rel="noopener noreferrer"
          href={credential?.url}
          className="max-w-[200px]"
        >
          {credential?.name}
        </Button>
      </Tooltip>
    );
  }
  return (
    <Button variant="subtle" compact color="dark" className="max-w-[200px]">
      {credential?.name}
    </Button>
  );
};

export default CredentialNameCopyButton;
