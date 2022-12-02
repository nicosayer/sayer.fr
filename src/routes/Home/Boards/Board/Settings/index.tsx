import { Stack, Title } from "@mantine/core";
import { FC } from "react";
import DeleteCard from "./Cards/Delete";
import SettingsCard from "./Cards/Settings";

const Settings: FC = () => {
  return (
    <Stack>
      <Title order={3}>Paramètres</Title>
      <SettingsCard />
      <DeleteCard />
    </Stack>
  );
};

export default Settings;
