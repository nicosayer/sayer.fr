import { Stack, Tabs, Text } from "@mantine/core";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { useBoard } from "../Provider";
import BoardCard from "./Cards/Board";
import DeleteBoardCard from "./Cards/DeleteBoard";
import UserCard from "./Cards/User";

const Settings: FC = () => {
  const { boardId } = useParams();
  const { boards } = useBoard();

  return (
    <Stack>
      <Text fw={500}>Paramètres</Text>
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
