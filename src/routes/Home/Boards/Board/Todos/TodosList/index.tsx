import { Card, Stack, Text } from "@mantine/core";
import { IconLayoutList } from "@tabler/icons-react";
import NoResult from "components/organisms/NoResult";
import { groupBy, orderBy } from "lodash";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import TodoCardContent from "routes/Home/Boards/Board/Todos/TodosList/TodoCardContent";
import { searchString } from "utils/string";

export interface TodosListProps {
  search: string;
}

const TodosList: FC<TodosListProps> = ({ search }) => {
  const { todos } = useBoard();

  const filteredTodos = useMemo(() => {
    return groupBy(
      orderBy(
        (todos ?? []).filter((todo) => {
          return searchString(`${todo.name}`, search);
        }),
        (todo) => todo.updatedAt?.seconds,
        "desc"
      ),
      (todo) => Boolean(todo.closedAt)
    );
  }, [todos, search]);

  if (!todos?.length) {
    return (
      <div className="my-10 text-center">
        <IconLayoutList size={36} className="text-gray-500" />
        <Text c="dimmed">Aucun todo</Text>
      </div>
    );
  }

  if (
    (filteredTodos.false ?? []).length + (filteredTodos.true ?? []).length ===
    0
  ) {
    return <NoResult />;
  }

  return (
    <Stack>
      {(filteredTodos.false ?? []).map((todo) => {
        return (
          <Card key={todo.id} withBorder>
            <TodoCardContent todo={todo} />
          </Card>
        );
      })}
      {(filteredTodos.true ?? []).map((todo) => {
        return (
          <Card key={todo.id} withBorder className="opacity-50">
            <TodoCardContent todo={todo} />
          </Card>
        );
      })}
    </Stack>
  );
};

export default TodosList;
