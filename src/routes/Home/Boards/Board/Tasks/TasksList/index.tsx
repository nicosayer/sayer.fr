import { Card, Stack, Text } from "@mantine/core";
import { IconLayoutList } from "@tabler/icons";
import NoResult from "components/organisms/NoResult";
import TaskCardContent from "components/organisms/TaskCardContent";
import { groupBy, orderBy } from "lodash";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { searchString } from "utils/string";

export interface TasksListProps {
  search: string;
}

const TasksList: FC<TasksListProps> = ({ search }) => {
  const { tasks } = useBoard();

  const filteredTasks = useMemo(() => {
    return groupBy(
      orderBy(
        (tasks ?? []).filter((task) => {
          return searchString(`${task.name}`, search);
        }),
        (task) => task.updatedAt?.seconds,
        "desc"
      ),
      (task) => Boolean(task.closedAt)
    );
  }, [tasks, search]);

  if (!tasks?.length) {
    return (
      <div className="my-10 text-center">
        <IconLayoutList size={36} className="text-gray-500" />
        <Text c="dimmed">Aucune tâche</Text>
      </div>
    );
  }

  if (
    (filteredTasks.false ?? []).length + (filteredTasks.true ?? []).length ===
    0
  ) {
    return <NoResult />;
  }

  return (
    <Stack>
      {(filteredTasks.false ?? []).map((task) => {
        return (
          <Card key={task.id} withBorder>
            <TaskCardContent task={task} />
          </Card>
        );
      })}
      {(filteredTasks.true ?? []).map((task) => {
        return (
          <Card key={task.id} withBorder className="opacity-50">
            <TaskCardContent task={task} />
          </Card>
        );
      })}
    </Stack>
  );
};

export default TasksList;
