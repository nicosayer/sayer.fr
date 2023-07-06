import { ActionIcon, Code, Group, Tooltip } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useDecrypt } from "providers/Crypto/hooks";
import { FC } from "react";
import { CredentialDocument } from "types/firebase/collections";

interface CredentialPasswordProps {
  credential: CredentialDocument;
}

const CredentialPassword: FC<CredentialPasswordProps> = ({ credential }) => {
  const { value, loading } = useDecrypt(credential.password);
  const clipboard = useClipboard();

  return (
    <Group spacing="xs">
      <Code>••••••••••</Code>
      <Tooltip
        disabled={loading}
        label={
          clipboard.copied ? "Mot de passe copié" : "Copier le mot de passe"
        }
        withArrow
      >
        <ActionIcon
          loading={loading}
          color={clipboard.copied && !loading ? "teal" : undefined}
          onClick={() => {
            clipboard.copy(value ?? "");
          }}
        >
          {clipboard.copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

export default CredentialPassword;
