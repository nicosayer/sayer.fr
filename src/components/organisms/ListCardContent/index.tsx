import {
  ActionIcon,
  Alert,
  Button,
  Checkbox,
  CopyButton,
  Group,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import { openConfirmModal, openModal } from "@mantine/modals";
import {
  IconCheck,
  IconDotsVertical,
  IconEdit,
  IconLink,
  IconSwitchHorizontal,
  IconTrash,
} from "@tabler/icons-react";
import { deleteDoc, updateDoc } from "firebase/firestore";
import { sortBy } from "lodash";
import { FC } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { ListDocument, ListItemDocument } from "types/firebase/collections";
import EditListModal from "./EditListModal";
import MoveListModal from "./MoveListModal";

export interface ListCardsPropContent {
  list: ListDocument;
  listItems: ListItemDocument[];
}
const openEditModal = (list: ListDocument, listItems: ListItemDocument[]) => {
  openModal({
    centered: true,
    title: "Modifier la liste",
    children: <EditListModal list={list} listItems={listItems} />,
  });
};

const openMoveModal = (list: ListDocument) => {
  openModal({
    centered: true,
    title: "Déplacer la liste",
    children: <MoveListModal list={list} />,
  });
};

const openDeleteModal = (list: ListDocument) => {
  openConfirmModal({
    title: "Supprimer la liste",
    centered: true,
    children: (
      <Text size="sm">
        Voulez-vous vraiment supprimer cette liste ? Cette action est définitive
        et irréversible.
      </Text>
    ),
    labels: { confirm: "Supprimer", cancel: "Annuler" },
    confirmProps: { color: "red" },
    onConfirm: () => {
      if (list.ref) {
        deleteDoc(list.ref);
      }
    },
  });
};

const ListCardContent: FC<ListCardsPropContent> = ({ list, listItems }) => {
  const { boards } = useBoard();

  return (
    <Stack align="center">
      <Group spacing="xs">
        <Text weight={500}>{list.name}</Text>
      </Group>
      <Alert color="gray">
        <Stack spacing="xs">
          {sortBy(listItems, "order")?.map((listItem) => {
            return (
              <Checkbox
                key={listItem.id}
                label={listItem.name}
                checked={listItem.checked}
                onChange={(event) => {
                  if (listItem.ref) {
                    updateDoc<ListItemDocument>(listItem.ref, {
                      checked: event.currentTarget.checked,
                    });
                  }
                }}
                classNames={{
                  label: "cursor-pointer",
                  input: "cursor-pointer",
                }}
              />
            );
          })}
        </Stack>
      </Alert>
      <Group className="w-full">
        <Button
          variant="light"
          className="flex-1"
          onClick={() => {
            listItems?.forEach((listItem) => {
              if (listItem.ref) {
                updateDoc<ListItemDocument>(listItem.ref, {
                  checked: false,
                });
              }
            });
          }}
        >
          Réinitialiser
        </Button>
        <CopyButton value={`${window.location.host}/${list.ref?.path}`}>
          {({ copied, copy }) => (
            <Menu shadow="md" width={200} withinPortal>
              <Menu.Target>
                <ActionIcon
                  variant="light"
                  radius="md"
                  size={36}
                  color={copied ? "teal" : undefined}
                >
                  {copied ? (
                    <IconCheck size={18} />
                  ) : (
                    <IconDotsVertical size={18} />
                  )}
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item icon={<IconLink size={18} />} onClick={copy}>
                  Copier le lien
                </Menu.Item>
                {(boards?.length ?? 0) > 1 ? (
                  <Menu.Item
                    onClick={() => {
                      openMoveModal(list);
                    }}
                    icon={<IconSwitchHorizontal size={18} />}
                  >
                    Déplacer
                  </Menu.Item>
                ) : undefined}
                <Menu.Item
                  onClick={() => {
                    if (listItems) {
                      openEditModal(list, listItems);
                    }
                  }}
                  icon={<IconEdit size={18} />}
                >
                  Modifier
                </Menu.Item>
                <Menu.Item
                  color="red"
                  onClick={() => {
                    openDeleteModal(list);
                  }}
                  icon={<IconTrash size={18} />}
                >
                  Supprimer
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </CopyButton>
      </Group>
    </Stack>
  );
};

export default ListCardContent;
