import { CloseButton, Group, Stack, Text, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import NewTodoCard from "routes/Home/Boards/Board/Todos/NewTodoCard";
import TodosList from "routes/Home/Boards/Board/Todos/TodosList";

const Todos: FC = () => {
  const { loadingTodos, todos } = useBoard();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("s") ?? "");
  const [debouncedSearch] = useDebouncedValue(search, 200);

  useEffect(() => {
    setSearchParams(debouncedSearch ? { s: debouncedSearch } : undefined);
  }, [debouncedSearch, setSearchParams]);

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
          rightSection={
            search && (
              <CloseButton
                onClick={() => {
                  setSearch("");
                }}
              />
            )
          }
        />
      </Group>
      <NewTodoCard />
      <TodosList search={debouncedSearch} />
    </Stack>
  );
};

export default Todos;
