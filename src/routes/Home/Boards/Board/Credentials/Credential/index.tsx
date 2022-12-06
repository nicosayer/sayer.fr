import { Badge, Group, Modal, Stack } from "@mantine/core";
import CredentialName from "components/organisms/CredentialName";
import CredentialPassword from "components/organisms/CredentialPassword";
import CredentialUsername from "components/organisms/CredentialUsername";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getColorFromString } from "utils/color";
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
    <Modal
      opened={Boolean(credentialId)}
      onClose={() => navigate(`/boards/${board?.id}/credentials`)}
      withCloseButton={false}
      centered
      trapFocus={false}
    >
      <Stack>
        <Group position="center">
          <CredentialName credential={credential} fw={600} />
          {credential.tag && (
            <Badge
              variant="dot"
              color={getColorFromString(credential.tag)}
              className="absolute right-[16px]"
            >
              {credential.tag}
            </Badge>
          )}
        </Group>
        <Group position="center" spacing="xs">
          <div>Nom d'utilisateur :</div>
          <CredentialUsername credential={credential} />
        </Group>
        <Group position="center" spacing="xs">
          <div>Mot de passe :</div>
          <CredentialPassword credential={credential} />
        </Group>
      </Stack>
    </Modal>
  );
};

export default Credential;
