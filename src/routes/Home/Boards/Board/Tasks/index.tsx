import { Group, LoadingOverlay, Stack, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { FC, useState } from "react";
import { useBoard } from "../Provider";
import NewTaskCard from "./NewTaskCard";
import Task from "./Task";
import TasksCards from "./TasksCards";

const Tasks: FC = () => {
  const { boards, loading, tasks } = useBoard();
  const [search, setSearch] = useState("");

  if (!tasks || loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <>
      <Task />
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
    </>
  );
};

export default Tasks;
