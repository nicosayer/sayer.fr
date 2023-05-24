import { Modal } from "@mantine/core";
import ListCardContent from "components/organisms/ListCardContent";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBoard } from "../../Provider";

const List: FC = () => {
  const { lists } = useBoard();
  const { boardId, listId } = useParams();
  const navigate = useNavigate();

  const list = useMemo(() => {
    return lists?.find((list) => list.id === listId);
  }, [listId, lists]);

  if (!list) {
    return null;
  }

  return (
    <Modal
      opened={Boolean(listId)}
      onClose={() => navigate(`/boards/${boardId}/lists`)}
      centered
      withCloseButton={false}
      trapFocus={false}
      size="xl"
    >
      <ListCardContent list={list} />
    </Modal>
  );
};

export default List;
