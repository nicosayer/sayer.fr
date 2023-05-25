import { Group, Stack, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import { FC, useState } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import NewTodoCard from "routes/Home/Boards/Board/Todos/NewTodoCard";
import TodosList from "routes/Home/Boards/Board/Todos/TodosList";

const Todos: FC = () => {
  const { loadingTodos, todos } = useBoard();
  const [search, setSearch] = useState("");

  if (!todos || loadingTodos) {
    return <LoadingOverlay visible />;
  }

  return (
    <Stack>
      <Group position="apart" className="sticky z-50">
        <Group spacing="xs">
          <Text weight={500}>Todos</Text>
          <Text c="dimmed">
            ({todos.filter((todo) => !todo.closedAt).length})
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
      <NewTodoCard />
      <TodosList search={search} />
    </Stack>
  );
};

export default Todos;
