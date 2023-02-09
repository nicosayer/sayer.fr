import { Stack, Tabs, Text } from "@mantine/core";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { useBoards } from "../../Provider";
import { useBoard } from "../Provider";
import BoardCard from "./Cards/Board";
import DeleteBoardCard from "./Cards/DeleteBoard";
import UserCard from "./Cards/User";

const Settings: FC = () => {
  const { boardId } = useParams();
  const { boards, tags } = useBoard();
  const { tags: boardsTags } = useBoards();

  return (
    <Stack>
      <Text weight={500}>Paramètres</Text>
      {boards?.length === 1 ? (
        <>
          <UserCard />
          <BoardCard board={boards?.[0]} tags={tags} />
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
                <BoardCard
                  board={board}
                  tags={boardsTags[String(board.id)] ?? []}
                />
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
