import {
  ActionIcon,
  Badge,
  Checkbox,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import { deleteDoc, updateDoc } from "firebase/firestore";
import { FC } from "react";
import { TaskDocument } from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import { formatDate } from "utils/dayjs";

export interface TaskCardContentProps {
  task: TaskDocument;
}

const TaskCardContent: FC<TaskCardContentProps> = ({ task }) => {
  return (
    <Group position="apart" noWrap className="whitespace-nowrap">
      <Checkbox
        checked={Boolean(task.done)}
        className="flex overflow-hidden"
        classNames={{
          input: "cursor-pointer",
          label: "cursor-pointer",
        }}
        label={task.description}
        onChange={() => {
          if (task.ref && task.done) {
            updateDoc<TaskDocument>(task.ref, {
              done: false,
            });
          }
        }}
      />
      <Group>
        {task.tag && (
          <Badge variant="dot" color={getColorFromString(task.tag)}>
            {task.tag}
          </Badge>
        )}
        <Text c="dimmed" fz="sm">
          {formatDate(task.date)}
        </Text>
        {task.done && (
          <Tooltip label="Supprimer" withinPortal>
            <ActionIcon
              variant="subtle"
              color="red"
              size="sm"
              onClick={() => {
                if (task.ref) {
                  deleteDoc(task.ref);
                }
              }}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Group>
  );
};

export default TaskCardContent;
