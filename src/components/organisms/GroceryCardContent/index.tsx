import { ActionIcon, Checkbox, Group, Menu, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { openModal } from "@mantine/modals";
import {
  IconDotsVertical,
  IconEdit,
  IconSwitchHorizontal,
  IconTrash,
} from "@tabler/icons";
import { deleteDoc, deleteField, Timestamp } from "firebase/firestore";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { GroceryDocument } from "types/firebase/collections";
import { formatDate } from "utils/dayjs";
import { auth, updateDoc } from "utils/firebase";
import { getEmailLocale } from "utils/string";
import EditGroceryModal from "./EditGroceryModal";
import MoveGroceryModal from "./MoveGroceryModal";

export interface GroceryCardContentProps {
  grocery: GroceryDocument;
}

const openMoveModal = (grocery: GroceryDocument) => {
  openModal({
    centered: true,
    zIndex: 1000,
    title: "Déplacer la course",
    children: <MoveGroceryModal grocery={grocery} />,
  });
};

const openEditModal = (grocery: GroceryDocument) => {
  openModal({
    centered: true,
    zIndex: 1000,
    title: "Modifer la course",
    children: <EditGroceryModal grocery={grocery} />,
  });
};

const GroceryCardContent: FC<GroceryCardContentProps> = ({ grocery }) => {
  const is768Px = useMediaQuery("(min-width: 768px)", true);
  const [user] = useAuthState(auth);
  const { boards } = useBoard();

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
      <Group>
        {is768Px && (
          <Text c="dimmed" fz="sm">
            {grocery.closedAt
              ? `fermé par ${getEmailLocale(
                  grocery.closedBy ?? ""
                )} le ${formatDate(grocery.closedAt.toDate(), "D MMM")}`
              : `ajouté par ${getEmailLocale(
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
                Déplacer
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
