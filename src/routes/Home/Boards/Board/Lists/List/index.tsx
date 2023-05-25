import { Modal } from "@mantine/core";
import ListCardContent from "components/organisms/ListCardContent";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBoard } from "routes/Home/Boards/Board/Provider";

const List: FC = () => {
  const { lists, listItems } = useBoard();
  const { boardId, listId } = useParams();
  const navigate = useNavigate();

  const list = useMemo(() => {
    return lists?.find((list) => list.id === listId);
  }, [listId, lists]);

  if (!list || !listItems) {
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
      <ListCardContent
        list={list}
        listItems={listItems.filter((listItem) => {
          return list.id && listItem.ref?.path.includes(list.id);
        })}
      />
    </Modal>
  );
};

export default List;
