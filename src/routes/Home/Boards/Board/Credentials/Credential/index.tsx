import { Drawer, Input, Stack } from "@mantine/core";
import CredentialNameCopyButton from "components/molecules/CopyButton/CredentialName";
import CredentialPasswordCopyButton from "components/molecules/CopyButton/CredentialPassword";
import CredentialUsernameCopyButton from "components/molecules/CopyButton/CredentialUsername";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBoard } from "../../Provider";

const Credential: FC = () => {
  const { board, credentials } = useBoard();
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
      onClose={() => navigate(`/boards/${board?.id}/credentials`)}
      title="Mot de passe"
      padding="xl"
      position="right"
    >
      <Stack spacing="xl">
        <Input.Wrapper label="Site web">
          <div>
            <CredentialNameCopyButton credential={credential} />
          </div>
        </Input.Wrapper>
        <Input.Wrapper label="Nom d'utilisateur">
          <div>
            <CredentialUsernameCopyButton credential={credential} />
          </div>
        </Input.Wrapper>
        <Input.Wrapper label="Mot de passe">
          <div>
            <CredentialPasswordCopyButton credential={credential} />
          </div>
        </Input.Wrapper>
      </Stack>
    </Drawer>
  );
};

export default Credential;
