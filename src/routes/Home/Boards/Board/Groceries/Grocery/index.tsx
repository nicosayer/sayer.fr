import { Modal } from "@mantine/core";
import GroceryCardContent from "components/organisms/GroceryCardContent";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBoard } from "../../Provider";

const Grocery: FC = () => {
  const { groceries } = useBoard();
  const { boardId, groceryId } = useParams();
  const navigate = useNavigate();

  const grocery = useMemo(() => {
    return groceries?.find((grocery) => grocery.id === groceryId);
  }, [groceryId, groceries]);

  if (!grocery) {
    return null;
  }

  return (
    <Modal
      opened={Boolean(groceryId)}
      onClose={() => navigate(`/boards/${boardId}/groceries`)}
      withCloseButton={false}
      centered
      trapFocus={false}
      size="xl"
    >
      <GroceryCardContent grocery={grocery} />
    </Modal>
  );
};

export default Grocery;
