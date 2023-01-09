import { Badge, Checkbox, Menu } from "@mantine/core";
import { xor } from "lodash";
import { FC, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { useBoards } from "../../../Provider";

const ExtraBoardsBadge: FC = () => {
  const { boards: currentBoards, setExtraBoardIds } = useBoard();
  const { boards } = useBoards();
  const { boardId } = useParams();

  const otherBoards = useMemo(() => {
    return boards?.filter((board) => board.id !== boardId) ?? [];
  }, [boards, boardId]);

  if (!otherBoards.length) {
    return null;
  }

  return (
    <Menu
      shadow="md"
      width={200}
      withinPortal
      trigger="hover"
      position="bottom-start"
    >
      <Menu.Target>
        <Badge>+{(currentBoards?.length ?? 1) - 1}</Badge>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Afficher le contenu des boards</Menu.Label>
        {boards?.map((board) => (
          <Menu.Item
            key={board.id}
            disabled={board.id === boardId}
            icon={
              <Checkbox
                disabled={board.id === boardId}
                checked={Boolean(
                  currentBoards?.find(
                    (currentBoard) => currentBoard.id === board.id
                  )
                )}
                readOnly
                classNames={{
                  input: "cursor-pointer",
                }}
              />
            }
            onClick={() => {
              if (board.id) {
                setExtraBoardIds((old) => xor(old, [board.id]) as string[]);
              }
            }}
          >
            {board.name}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default ExtraBoardsBadge;
