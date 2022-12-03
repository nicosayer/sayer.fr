import { Button, Card, Input, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { deleteDoc } from "firebase/firestore";
import { FC } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";

const DeleteCard: FC = () => {
  const { board } = useBoard();

  return (
    <Card withBorder>
      <Input.Wrapper
        label="Supprimer le board"
        description="La suppression du board est définitive et irrémédiable"
      >
        <Button
          color="red"
          className="mt-1"
          onClick={() => {
            openConfirmModal({
              title: "Supprimer le board",
              centered: true,
              children: (
                <Text size="sm">
                  Voulez-vous vraiment supprimer ce board ? Cette action est
                  définitive et irrémédiable.
                </Text>
              ),
              labels: { confirm: "Supprimer", cancel: "Annuler" },
              confirmProps: { color: "red" },
              onConfirm: () => {
                if (board?.ref) {
                  return deleteDoc(board.ref);
                }
              },
            });
          }}
        >
          Supprimer
        </Button>
      </Input.Wrapper>
    </Card>
  );
};

export default DeleteCard;
