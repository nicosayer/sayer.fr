import { Button, Input } from "@mantine/core";
import { IconLock, IconSettings } from "@tabler/icons-react";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CannotBeSecure: FC = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-xs mx-auto text-center">
      <IconLock size={36} className="text-gray-500" />
      <Input.Wrapper label="Veuillez définir un mot de passe pour accéder à cette fonctionnalité">
        <Button
          variant="default"
          leftIcon={<IconSettings size={18} />}
          onClick={() => {
            navigate(`/boards/${boardId}/settings`);
          }}
        >
          Paramètres
        </Button>
      </Input.Wrapper>
    </div>
  );
};

export default CannotBeSecure;
