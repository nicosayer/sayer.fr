import {
  Button,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconPlus, IconSearch } from "@tabler/icons";
import { FC, useState } from "react";
import { useBoard } from "../Provider";
import NewTaskModal from "./NewTaskModal";
import Task from "./Task";
import TasksCards from "./TasksCards";

const Tasks: FC = () => {
  const { boards, loading, tasks } = useBoard();
  const [search, setSearch] = useState("");

  if (!tasks || loading) {
    return <LoadingOverlay visible />;
  }

  if (!tasks?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <Button
          size="lg"
          leftIcon={<IconPlus size={18} />}
          onClick={() => {
            if (boards) {
              openModal({
                centered: true,
                title: "Nouvelle tâche",
                children: <NewTaskModal boards={boards} />,
              });
            }
          }}
        >
          Ajouter votre première tâche
        </Button>
      </div>
    );
  }

  return (
    <>
      <Task />
      <Stack>
        <Group position="apart" className="sticky z-50">
          <Text fw={500}>Tâches</Text>
          <Group>
            <TextInput
              placeholder="Rechercher"
              variant="filled"
              icon={<IconSearch size={18} />}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
            <Button
              variant="default"
              leftIcon={<IconPlus size={18} />}
              onClick={() => {
                if (boards) {
                  openModal({
                    centered: true,
                    title: "Nouvelle tâche",
                    children: <NewTaskModal boards={boards} />,
                  });
                }
              }}
            >
              Nouvelle tâche
            </Button>
          </Group>
        </Group>
        <TasksCards search={search} />
      </Stack>
    </>
  );
};

export default Tasks;
