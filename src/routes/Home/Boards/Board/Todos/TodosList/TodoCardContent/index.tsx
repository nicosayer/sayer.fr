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
import EditTodoModalContent from "routes/Home/Boards/Board/Todos/TodosList/TodoCardContent/EditTodoModalContent";
import MoveTodoModalContent from "routes/Home/Boards/Board/Todos/TodosList/TodoCardContent/MoveTodoModalContent";
import { TodoDocument } from "types/firebase/collections";
import { formatDate } from "utils/dayjs";
import { auth, updateDoc } from "utils/firebase";
import { getEmailLocale } from "utils/string";

export interface TodoCardContentProps {
  todo: TodoDocument;
}

const openMoveModal = (todo: TodoDocument) => {
  openModal({
    centered: true,
    title: "Déplacer le todo",
    children: <MoveTodoModalContent todo={todo} />,
  });
};

const openEditModal = (todo: TodoDocument) => {
  openModal({
    centered: true,
    title: "Modifier le todo",
    children: <EditTodoModalContent todo={todo} />,
  });
};

const TodoCardContent: FC<TodoCardContentProps> = ({ todo }) => {
  const is768Px = useMediaQuery("(min-width: 768px)", true);
  const [user] = useAuthState(auth);
  const { boards } = useBoard();

  return (
    <Group position="apart" noWrap className="whitespace-nowrap">
      <Checkbox
        checked={Boolean(todo.closedAt)}
        className="flex overflow-hidden"
        classNames={{
          input: "cursor-pointer",
          label: "cursor-pointer",
        }}
        label={todo.name}
        onChange={() => {
          if (todo.ref) {
            if (todo.closedAt) {
              updateDoc<TodoDocument>(todo.ref, {
                closedAt: deleteField(),
                closedBy: deleteField(),
              });
            } else if (user?.email) {
              updateDoc<TodoDocument>(todo.ref, {
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
            {todo.closedAt
              ? `fermé par ${getEmailLocale(
                  todo.closedBy ?? ""
                )} le ${formatDate(todo.closedAt.toDate(), "D MMM")}`
              : `ajouté par ${getEmailLocale(
                  todo.openedBy ?? ""
                )} le ${formatDate(todo.openedAt?.toDate(), "D MMM")}`}
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
                  openMoveModal(todo);
                }}
                icon={<IconSwitchHorizontal size={18} />}
              >
                Déplacer
              </Menu.Item>
            ) : undefined}
            <Menu.Item
              onClick={() => {
                openEditModal(todo);
              }}
              icon={<IconEdit size={18} />}
            >
              Modifier
            </Menu.Item>
            <Menu.Item
              color="red"
              onClick={() => {
                if (todo.ref) {
                  deleteDoc(todo.ref);
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

export default TodoCardContent;
