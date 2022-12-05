import { Button, ButtonProps, Tooltip } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons";
import { FC } from "react";
import { CredentialDocument } from "types/firebase/collections";

interface CredentialNameCopyButtonProps extends ButtonProps {
  credential: CredentialDocument;
}

const CredentialNameCopyButton: FC<CredentialNameCopyButtonProps> = ({
  credential,
  ...rest
}) => {
  return (
    <Tooltip label="Aller sur le site" withArrow>
      <Button
        variant="subtle"
        compact
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
        {...rest}
      >
        {credential?.name}
      </Button>
    </Tooltip>
  );
};

export default CredentialNameCopyButton;
