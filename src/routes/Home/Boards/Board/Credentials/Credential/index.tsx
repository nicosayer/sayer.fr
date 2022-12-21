import { Modal } from "@mantine/core";
import CredentialCardContent from "components/organisms/CredentialCardContent";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ALL_BOARDS_SLUG } from "utils/boards";
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
      onClose={() =>
        navigate(`/boards/${board?.id ?? ALL_BOARDS_SLUG}/credentials`)
      }
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
