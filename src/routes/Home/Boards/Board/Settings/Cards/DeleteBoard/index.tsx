import { Button, Card, Input, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { deleteDoc } from "firebase/firestore";
import { FC } from "react";
import { BoardDocument } from "types/firebase/collections";

export interface DeleteBoardCardProps {
  board: BoardDocument;
}

const openDeleteModal = (board: BoardDocument) => {
  openConfirmModal({
    title: "Supprimer le board",
    centered: true,
    children: (
      <Text size="sm">
        Voulez-vous vraiment supprimer le board <b>{board.name}</b> ? Cette
        action est définitive et irréversible.
      </Text>
    ),
    labels: { confirm: "Supprimer", cancel: "Annuler" },
    confirmProps: { color: "red" },
    onConfirm: () => {
      if (board?.ref) {
        // TODO Delete subcollections
        return deleteDoc(board.ref);
      }
    },
  });
};

const DeleteBoardCard: FC<DeleteBoardCardProps> = ({ board }) => {
  return (
    <Card withBorder>
      <Input.Wrapper
        label="Supprimer le board"
        description="La suppression du board est définitive et irréversible"
      >
        <Button
          color="red"
          className="mt-1"
          onClick={() => {
            openDeleteModal(board);
          }}
        >
          Supprimer
        </Button>
      </Input.Wrapper>
    </Card>
  );
};

export default DeleteBoardCard;
