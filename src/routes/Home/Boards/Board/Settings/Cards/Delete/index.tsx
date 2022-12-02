import { Button, Card, Input } from "@mantine/core";
import { deleteDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { ONE_SECOND } from "utils/time";

const DeleteCard: FC = () => {
  const { board } = useBoard();
  const [loading, start, stop] = useBooleanState({ stopDelay: ONE_SECOND });

  return (
    <Card withBorder>
      <Input.Wrapper
        label="Supprimer le board"
        description="La suppression du board est irrémédiable"
      >
        <Button
          loading={loading}
          color="red"
          className="mt-1"
          onClick={() => {
            if (board?.ref) {
              start();
              deleteDoc(board.ref).finally(stop);
            }
          }}
        >
          Supprimer
        </Button>
      </Input.Wrapper>
    </Card>
  );
};

export default DeleteCard;
