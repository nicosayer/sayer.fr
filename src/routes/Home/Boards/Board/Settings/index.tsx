import { Stack, Tabs, Text } from "@mantine/core";
import { FC } from "react";
import { useBoard } from "../Provider";
import DeleteCard from "./Cards/Delete";
import SettingsCard from "./Cards/Settings";

const Settings: FC = () => {
  const { boards } = useBoard();

  return (
    <Stack>
      <Text fw={500}>Paramètres</Text>
      {boards?.length === 1 ? (
        <>
          <SettingsCard board={boards?.[0]} />
          <DeleteCard board={boards?.[0]} />
        </>
      ) : (
        <Tabs defaultValue={boards?.[0].id}>
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
                <SettingsCard board={board} />
                <DeleteCard board={board} />
              </Stack>
            </Tabs.Panel>
          ))}
        </Tabs>
      )}
    </Stack>
  );
};

export default Settings;
