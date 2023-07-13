import { Group, Menu, Text } from "@mantine/core";
import { IconLayoutList } from "@tabler/icons-react";
import useWindowSize from "hooks/useWindowSize";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { useBoards } from "routes/Home/Boards/Provider";

const Title: FC = () => {
  const { board } = useBoard();
  const { boards } = useBoards();
  const { boardId } = useParams();
  const { largerThan } = useWindowSize();
  const navigate = useNavigate();

  const otherBoards = useMemo(() => {
    return boards?.filter((board) => board.id !== boardId) ?? [];
  }, [boards, boardId]);

  const title = useMemo(() => {
    return (
      <Group spacing="xs">
        {largerThan("md") ? <IconLayoutList size={18} /> : null}
        <Text
          weight={500}
          className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {board?.name}
        </Text>
      </Group>
    );
  }, [board?.name, largerThan]);

  if (!otherBoards.length) {
    return title;
  }

  return (
    <Menu
      shadow="md"
      width={200}
      withinPortal
      trigger="hover"
      position="bottom-start"
    >
      <Menu.Target>{title}</Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Changer de board</Menu.Label>
        {otherBoards.map((board) => (
          <Menu.Item
            key={board.id}
            onClick={() => {
              navigate(`../${board.id}`);
            }}
          >
            {board.name}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default Title;
