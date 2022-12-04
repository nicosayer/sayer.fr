import { Stack, Text } from "@mantine/core";
import { FC } from "react";
import DeleteCard from "./Cards/Delete";
import SettingsCard from "./Cards/Settings";

const Settings: FC = () => {
  return (
    <Stack>
      <Text fw={500}>Paramètres</Text>
      <SettingsCard />
      <DeleteCard />
    </Stack>
  );
};

export default Settings;
