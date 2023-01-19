import { Card, Stack, Text } from "@mantine/core";
import { IconLayoutList } from "@tabler/icons";
import NoResult from "components/organisms/NoResult";
import TaskCardContent from "components/organisms/TaskCardContent";
import dayjs from "dayjs";
import { updateDoc } from "firebase/firestore";
import { groupBy, orderBy } from "lodash";
import { FC, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { TaskDocument } from "types/firebase/collections";
import { auth } from "utils/firebase";
import { searchString } from "utils/string";

export interface TasksCardsProps {
  search: string;
}

const TasksCards: FC<TasksCardsProps> = ({ search }) => {
  const { tasks } = useBoard();
  const [user] = useAuthState(auth);

  const filteredTasks = useMemo(() => {
    return groupBy(
      orderBy(
        (tasks ?? []).filter((task) => {
          return searchString(`${task.name}${task.tag}`, search);
        }),
        "order",
        "desc"
      ),
      (task) => Boolean(task.closeDate)
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
          <Card
            key={task.id}
            withBorder
            className="cursor-pointer"
            onClick={() => {
              if (task.ref) {
                updateDoc<TaskDocument>(task.ref, {
                  closeDate: dayjs().format("YYYY-MM-DD"),
                  closedBy: user?.email ?? undefined,
                });
              }
            }}
          >
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
