import {
  ActionIcon,
  Badge,
  Checkbox,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons";
import { deleteDoc, deleteField } from "firebase/firestore";
import { FC } from "react";
import { TaskDocument } from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import { formatDate } from "utils/dayjs";
import { updateDoc } from "utils/firebase";
import { getEmailLocale } from "utils/string";

export interface TaskCardContentProps {
  task: TaskDocument;
}

const TaskCardContent: FC<TaskCardContentProps> = ({ task }) => {
  const is768Px = useMediaQuery("(min-width: 768px)");

  return (
    <Group position="apart" noWrap className="whitespace-nowrap">
      <Checkbox
        checked={Boolean(task.closedAt)}
        className="flex overflow-hidden"
        classNames={{
          input: "cursor-pointer",
          label: "cursor-pointer",
        }}
        label={task.name}
        onChange={() => {
          if (task.ref && task.closedAt) {
            updateDoc<TaskDocument>(task.ref, {
              closedAt: deleteField(),
              closedBy: deleteField(),
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
        {is768Px && (
          <Text c="dimmed" fz="sm">
            {task.closedAt
              ? `fermé par ${getEmailLocale(
                  task.closedBy ?? ""
                )} le ${formatDate(task.closedAt.toDate(), "D MMM")}`
              : `ajouté par ${getEmailLocale(
                  task.openedBy ?? ""
                )} le ${formatDate(task.openedAt?.toDate(), "D MMM")}`}
          </Text>
        )}
        {task.closedAt && (
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
