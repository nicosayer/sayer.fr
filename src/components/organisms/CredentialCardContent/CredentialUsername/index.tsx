import { ActionIcon, Code, CopyButton, Group, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { FC } from "react";
import { CredentialDocument } from "types/firebase/collections";

interface CredentialUsernameProps {
  credential: CredentialDocument;
}

const CredentialUsername: FC<CredentialUsernameProps> = ({ credential }) => {
  return (
    <Group spacing="xs">
      <Code className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        {credential?.username}
      </Code>
      <CopyButton value={String(credential?.username)}>
        {({ copied, copy }) => (
          <Tooltip
            label={copied ? "Identifiant copié" : "Copier l'identifiant"}
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

export default CredentialUsername;
