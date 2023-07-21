import { Group, Stack, Text } from "@mantine/core";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import SearchTextInput from "components/molecules/TextInput/Search";
import useSearch from "hooks/useSearch";
import { FC } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import NewTodoCard from "routes/Home/Boards/Board/Todos/NewTodoCard";
import TodosList from "routes/Home/Boards/Board/Todos/TodosList";

const Todos: FC = () => {
  const { loadingTodos, todos } = useBoard();
  const { search, setSearch, debouncedSearch } = useSearch();

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
        <SearchTextInput search={search} setSearch={setSearch} />
      </Group>
      <NewTodoCard />
      <TodosList search={debouncedSearch} />
    </Stack>
  );
};

export default Todos;
