import { ActionIcon, Code, CopyButton, Group, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons";
import { FC } from "react";
import { CredentialDocument } from "types/firebase/collections";

interface CredentialPasswordProps {
  credential: CredentialDocument;
}

const CredentialPassword: FC<CredentialPasswordProps> = ({ credential }) => {
  return (
    <Group spacing="xs">
      <Code>••••••••••</Code>
      <CopyButton value={String(credential?.password)}>
        {({ copied, copy }) => (
          <Tooltip
            label={copied ? "Mot de passe copié" : "Copier le mot de passe"}
            withArrow
          >
            <ActionIcon color={copied ? "teal" : undefined} onClick={copy}>
              {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
    </Group>
  );
};

export default CredentialPassword;
