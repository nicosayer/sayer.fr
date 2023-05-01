import { ActionIcon, Code, Group, Tooltip } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { IconCheck, IconCopy, IconX } from "@tabler/icons-react";
import { useDecrypt } from "hooks/useCrypto";
import { FC } from "react";
import { CredentialDocument } from "types/firebase/collections";

interface CredentialPasswordProps {
  credential: CredentialDocument;
}

const CredentialPassword: FC<CredentialPasswordProps> = ({ credential }) => {
  const { decrypt, loading, error } = useDecrypt();
  const clipboard = useClipboard();

  return (
    <Group spacing="xs">
      <Code>••••••••••</Code>
      <Tooltip
        disabled={loading}
        label={
          clipboard.copied
            ? error
              ? "Erreur"
              : "Mot de passe copié"
            : "Copier le mot de passe"
        }
        withArrow
      >
        <ActionIcon
          loading={loading}
          color={
            clipboard.copied && !loading ? (error ? "red" : "teal") : undefined
          }
          onClick={async () => {
            const password = await decrypt(credential.password);

            clipboard.copy(password?.data ?? "");
          }}
        >
          {clipboard.copied ? (
            error ? (
              <IconX size={18} />
            ) : (
              <IconCheck size={18} />
            )
          ) : (
            <IconCopy size={18} />
          )}
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

export default CredentialPassword;
