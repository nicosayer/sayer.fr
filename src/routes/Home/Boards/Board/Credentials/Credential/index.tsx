import { Drawer, Group, Stack, Text } from "@mantine/core";
import CredentialNameCopyButton from "components/molecules/CopyButton/CredentialName";
import CredentialPasswordCopyButton from "components/molecules/CopyButton/CredentialPassword";
import CredentialUsernameCopyButton from "components/molecules/CopyButton/CredentialUsername";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBoard } from "../../Provider";

const Credential: FC = () => {
  const { credentials } = useBoard();
  const { credentialId } = useParams();
  const navigate = useNavigate();

  const credential = useMemo(() => {
    return credentials?.find((credential) => credential.id === credentialId);
  }, [credentialId, credentials]);

  if (!credential) {
    return null;
  }

  return (
    <Drawer
      opened={Boolean(credentialId)}
      onClose={() => navigate("../")}
      title="Mot de passe"
      padding="xl"
      position="right"
    >
      <Stack>
        <Group spacing="xs">
          <Text>Site web</Text>
          <Text>:</Text>
          <CredentialNameCopyButton credential={credential} />
        </Group>
        <Group spacing="xs">
          <Text>Nom d'utilisateur</Text>
          <Text>:</Text>
          <CredentialUsernameCopyButton credential={credential} />
        </Group>
        <Group spacing="xs">
          <Text>Mot de passe</Text>
          <Text>:</Text>
          <CredentialPasswordCopyButton credential={credential} />
        </Group>
      </Stack>
    </Drawer>
  );
};

export default Credential;
