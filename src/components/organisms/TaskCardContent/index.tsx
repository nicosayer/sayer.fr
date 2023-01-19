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
import { deleteDoc, updateDoc } from "firebase/firestore";
import { FC } from "react";
import { TaskDocument } from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import { formatDate } from "utils/dayjs";
import { getEmailLocale } from "utils/string";

export interface TaskCardContentProps {
  task: TaskDocument;
}

const TaskCardContent: FC<TaskCardContentProps> = ({ task }) => {
  const is768Px = useMediaQuery("(min-width: 768px)");

  return (
    <Group position="apart" noWrap className="whitespace-nowrap">
      <Checkbox
        checked={Boolean(task.closeDate)}
        className="flex overflow-hidden"
        classNames={{
          input: "cursor-pointer",
          label: "cursor-pointer",
        }}
        label={task.name}
        onChange={() => {
          if (task.ref && task.closeDate) {
            updateDoc<TaskDocument>(task.ref, {
              closeDate: "",
              closedBy: "",
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
            {task.closeDate
              ? `fermé par ${getEmailLocale(
                  task.closedBy ?? ""
                )} le ${formatDate(task.closeDate, "D MMM")}`
              : `ajouté par ${getEmailLocale(
                  task.openedBy ?? ""
                )} le ${formatDate(task.openDate, "D MMM")}`}
          </Text>
        )}
        {task.closeDate && (
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
