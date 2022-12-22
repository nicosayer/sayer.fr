import { Card, Stack } from "@mantine/core";
import TaskCardContent from "components/organisms/TaskCardContent";
import { groupBy, orderBy } from "lodash";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { searchString } from "utils/string";

export interface TasksCardsProps {
  search: string;
}

const TasksCards: FC<TasksCardsProps> = ({ search }) => {
  const { tasks } = useBoard();

  const filteredTasks = useMemo(() => {
    return groupBy(
      orderBy(
        (tasks ?? []).filter((task) => {
          return searchString(`${task.description}${task.tag}`, search);
        }),
        "order",
        "desc"
      ),
      (task) => Boolean(task.done)
    );
  }, [tasks, search]);

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

export default TasksCards;
