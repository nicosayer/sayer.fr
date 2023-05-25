import { ActionIcon, Checkbox, Group, Menu, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { openModal } from "@mantine/modals";
import {
  IconDotsVertical,
  IconEdit,
  IconSwitchHorizontal,
  IconTrash,
} from "@tabler/icons-react";
import { deleteDoc, deleteField, Timestamp } from "firebase/firestore";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import EditTaskModalContent from "routes/Home/Boards/Board/Tasks/TasksList/TaskCardContent/EditTaskModalContent";
import MoveTaskModalContent from "routes/Home/Boards/Board/Tasks/TasksList/TaskCardContent/MoveTaskModalContent";
import { TaskDocument } from "types/firebase/collections";
import { formatDate } from "utils/dayjs";
import { auth, updateDoc } from "utils/firebase";
import { getEmailLocale } from "utils/string";

export interface TaskCardContentProps {
  task: TaskDocument;
}

const openMoveModal = (task: TaskDocument) => {
  openModal({
    centered: true,
    title: "Déplacer la tâche",
    children: <MoveTaskModalContent task={task} />,
  });
};

const openEditModal = (task: TaskDocument) => {
  openModal({
    centered: true,
    title: "Modifier la tâche",
    children: <EditTaskModalContent task={task} />,
  });
};

const TaskCardContent: FC<TaskCardContentProps> = ({ task }) => {
  const is768Px = useMediaQuery("(min-width: 768px)", true);
  const [user] = useAuthState(auth);
  const { boards } = useBoard();

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
          if (task.ref) {
            if (task.closedAt) {
              updateDoc<TaskDocument>(task.ref, {
                closedAt: deleteField(),
                closedBy: deleteField(),
              });
            } else if (user?.email) {
              updateDoc<TaskDocument>(task.ref, {
                closedAt: Timestamp.now(),
                closedBy: user.email,
              });
            }
          }
        }}
      />
      <Group noWrap className="whitespace-nowrap">
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
        <Menu shadow="md" width={200} withinPortal>
          <Menu.Target>
            <ActionIcon variant="light">
              <IconDotsVertical size={18} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            {(boards?.length ?? 0) > 1 ? (
              <Menu.Item
                onClick={() => {
                  openMoveModal(task);
                }}
                icon={<IconSwitchHorizontal size={18} />}
              >
                Déplacer
              </Menu.Item>
            ) : undefined}
            <Menu.Item
              onClick={() => {
                openEditModal(task);
              }}
              icon={<IconEdit size={18} />}
            >
              Modifier
            </Menu.Item>
            <Menu.Item
              color="red"
              onClick={() => {
                if (task.ref) {
                  deleteDoc(task.ref);
                }
              }}
              icon={<IconTrash size={18} />}
            >
              Supprimer
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};

export default TaskCardContent;
