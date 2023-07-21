import { ActionIcon, Checkbox, Group, Menu, Text } from "@mantine/core";
import { openModal } from "@mantine/modals";
import {
  IconDotsVertical,
  IconEdit,
  IconSwitchHorizontal,
  IconTrash,
} from "@tabler/icons-react";
import { deleteDoc, deleteField, Timestamp } from "firebase/firestore";
import useGetUserName from "hooks/useGetUserName";
import useWindowSize from "hooks/useWindowSize";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import EditGroceryModalContent from "routes/Home/Boards/Board/Groceries/GroceriesList/GroceryCardContent/EditGroceryModalContent";
import MoveGroceryModalContent from "routes/Home/Boards/Board/Groceries/GroceriesList/GroceryCardContent/MoveGroceryModalContent";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { GroceryDocument } from "types/firebase/collections";
import { formatDate } from "utils/dayjs";
import { auth, updateDoc } from "utils/firebase";

export interface GroceryCardContentProps {
  grocery: GroceryDocument;
}

const openMoveModal = (grocery: GroceryDocument) => {
  openModal({
    centered: true,
    title: "Déplacer la course",
    children: <MoveGroceryModalContent grocery={grocery} />,
  });
};

const openEditModal = (grocery: GroceryDocument) => {
  openModal({
    centered: true,
    title: "Modifer la course",
    children: <EditGroceryModalContent grocery={grocery} />,
  });
};

const GroceryCardContent: FC<GroceryCardContentProps> = ({ grocery }) => {
  const { largerThan } = useWindowSize();
  const [user] = useAuthState(auth);
  const { boards } = useBoard();
  const getUserName = useGetUserName();

  return (
    <Group position="apart" noWrap className="whitespace-nowrap">
      <Checkbox
        checked={Boolean(grocery.closedAt)}
        className="flex overflow-hidden"
        classNames={{
          input: "cursor-pointer",
          label: "cursor-pointer",
        }}
        label={grocery.name}
        onChange={() => {
          if (grocery.ref) {
            if (grocery.closedAt) {
              updateDoc<GroceryDocument>(grocery.ref, {
                closedAt: deleteField(),
                closedBy: deleteField(),
              });
            } else if (user?.email) {
              updateDoc<GroceryDocument>(grocery.ref, {
                closedAt: Timestamp.now(),
                closedBy: user.email,
              });
            }
          }
        }}
      />
      <Group noWrap className="whitespace-nowrap">
        {largerThan("md") && (
          <Text c="dimmed" fz="sm">
            {grocery.closedAt
              ? `fermé par ${getUserName(
                  grocery.closedBy ?? ""
                )} le ${formatDate(grocery.closedAt.toDate(), "D MMM")}`
              : `ajouté par ${getUserName(
                  grocery.openedBy ?? ""
                )} le ${formatDate(grocery.openedAt?.toDate(), "D MMM")}`}
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
                  openMoveModal(grocery);
                }}
                icon={<IconSwitchHorizontal size={18} />}
              >
                Déplacer de board
              </Menu.Item>
            ) : undefined}
            <Menu.Item
              onClick={() => {
                openEditModal(grocery);
              }}
              icon={<IconEdit size={18} />}
            >
              Modifier
            </Menu.Item>
            <Menu.Item
              color="red"
              onClick={() => {
                if (grocery.ref) {
                  deleteDoc(grocery.ref);
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

export default GroceryCardContent;
