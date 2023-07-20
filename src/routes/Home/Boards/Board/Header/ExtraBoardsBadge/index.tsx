import { Badge, Checkbox, Menu } from "@mantine/core";
import { xor } from "lodash";
import { FC, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { useBoards } from "routes/Home/Boards/Provider";

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
        <Menu.Label>Afficher également le contenu des boards</Menu.Label>
        {boards
          ?.filter((board) => board.id !== boardId)
          ?.map((board) => (
            <Menu.Item
              key={board.id}
              icon={
                <Checkbox
                  checked={Boolean(
                    currentBoards?.find(
                      (currentBoard) => currentBoard.id === board.id
                    )
                  )}
                  readOnly
                  className="pointer-events-none"
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
