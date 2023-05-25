import { Stack, Tabs, Text } from "@mantine/core";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import BoardCard from "routes/Home/Boards/Board/Settings/Cards/Board";
import DeleteBoardCard from "routes/Home/Boards/Board/Settings/Cards/DeleteBoard";
import UserCard from "routes/Home/Boards/Board/Settings/Cards/User";

const Settings: FC = () => {
  const { boardId } = useParams();
  const { boards } = useBoard();

  return (
    <Stack>
      <Text weight={500}>Paramètres</Text>
      {boards?.length === 1 ? (
        <>
          <UserCard />
          <BoardCard board={boards?.[0]} />
          <DeleteBoardCard board={boards?.[0]} />
        </>
      ) : (
        <Tabs defaultValue={boardId}>
          <Tabs.List>
            {boards?.map((board, index) => (
              <Tabs.Tab
                key={board.id}
                value={String(board.id)}
                icon={<Text c="dimmed">#{index + 1}</Text>}
              >
                {board.name}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {boards?.map((board) => (
            <Tabs.Panel key={board.id} value={String(board.id)} pt="xs">
              <Stack>
                <UserCard />
                <BoardCard board={board} />
                <DeleteBoardCard board={board} />
              </Stack>
            </Tabs.Panel>
          ))}
        </Tabs>
      )}
    </Stack>
  );
};

export default Settings;
