import { Group, Stack, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import { FC, useState } from "react";
import { useBoard } from "../Provider";
import NewTaskCard from "./NewTaskCard";
import TasksCards from "./TasksCards";

const Tasks: FC = () => {
  const { loadingTasks, tasks } = useBoard();
  const [search, setSearch] = useState("");

  if (!tasks || loadingTasks) {
    return <LoadingOverlay visible />;
  }

  return (
    <Stack>
      <Group position="apart" className="sticky z-50">
        <Text fw={500}>Tâches</Text>
        <TextInput
          placeholder="Rechercher"
          variant="filled"
          icon={<IconSearch size={18} />}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />
      </Group>
      <NewTaskCard />
      <TasksCards search={search} />
    </Stack>
  );
};

export default Tasks;
