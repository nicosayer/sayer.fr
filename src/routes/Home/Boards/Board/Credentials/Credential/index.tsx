import { Modal } from "@mantine/core";
import CredentialCardContent from "components/organisms/CredentialCardContent";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBoard } from "routes/Home/Boards/Board/Provider";

const Credential: FC = () => {
  const { credentials } = useBoard();
  const { boardId, credentialId } = useParams();
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
      onClose={() => navigate(`/boards/${boardId}/credentials`)}
      withCloseButton={false}
      centered
      trapFocus={false}
      size="xl"
    >
      <CredentialCardContent credential={credential} />
    </Modal>
  );
};

export default Credential;
