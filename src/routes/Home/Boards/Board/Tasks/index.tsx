import { Group, Stack, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import { FC, useState } from "react";
import { useBoard } from "../Provider";
import NewTaskCard from "./NewTaskCard";
import TasksList from "./TasksList";

const Tasks: FC = () => {
  const { loadingTasks, tasks } = useBoard();
  const [search, setSearch] = useState("");

  if (!tasks || loadingTasks) {
    return <LoadingOverlay visible />;
  }

  return (
    <Stack>
      <Group position="apart" className="sticky z-50">
        <Group spacing="xs">
          <Text weight={500}>Tâches</Text>
          <Text c="dimmed">
            ({tasks.filter((task) => !task.closedAt).length})
          </Text>
        </Group>
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
      <TasksList search={search} />
    </Stack>
  );
};

export default Tasks;
