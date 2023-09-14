import {
  ActionIcon,
  Alert,
  Badge,
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
import EditListModalContent from "components/organisms/ListCardContent/EditListModalContent";
import MoveListModalContent from "components/organisms/ListCardContent/MoveListModalContent";
import { deleteDoc } from "firebase/firestore";
import { sortBy } from "lodash";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import {
  ListDocument,
  ListItemDocument,
  ListItemStatus,
} from "types/firebase/collections";
import { runInParallel } from "utils/async";
import { formatDate } from "utils/dayjs";
import { updateDoc } from "utils/firebase";
import { getChecked, getColor, getIntermediate } from "utils/lists";
import { sanitize } from "utils/string";

export interface ListCardContentProps {
  list: ListDocument;
  listItems: ListItemDocument[];
}
const openEditModal = (list: ListDocument, listItems: ListItemDocument[]) => {
  openModal({
    centered: true,
    title: "Modifier la liste",
    children: <EditListModalContent list={list} listItems={listItems} />,
  });
};

const openMoveModal = (list: ListDocument) => {
  openModal({
    centered: true,
    title: "Déplacer la liste",
    children: <MoveListModalContent list={list} />,
  });
};

const openDeleteModal = (list: ListDocument, listItems: ListItemDocument[]) => {
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
        return deleteDoc(list.ref).then(() => {
          runInParallel(listItems, (listItem) => {
            if (listItem.ref) {
              return deleteDoc(listItem.ref);
            }
          });
        });
      }
    },
  });
};

const ListCardContent: FC<ListCardContentProps> = ({ list, listItems }) => {
  const { boards } = useBoard();

  const lastUpdatedAt = useMemo(() => {
    return (
      listItems.reduce((acc, listItem) => {
        if (listItem.updatedAt) {
          return Math.max(acc, listItem.updatedAt.seconds * 1000);
        }
        return acc;
      }, 0) || undefined
    );
  }, [listItems]);

  return (
    <Stack align="center">
      <Group spacing="xs">
        <Text weight={500}>{list.name}</Text>
        <Badge radius="sm" color="gray">
          {formatDate(lastUpdatedAt, "D MMM YYYY")}
        </Badge>
      </Group>
      <Alert color="gray">
        <Stack spacing="xs">
          {sortBy(listItems, (listItem) => sanitize(listItem.name ?? ""))?.map(
            (listItem) => {
              return (
                <Checkbox
                  key={listItem.id}
                  size="md"
                  label={listItem.name}
                  checked={getChecked(listItem)}
                  color={getColor(listItem)}
                  indeterminate={getIntermediate(listItem)}
                  onChange={(event) => {
                    if (listItem.ref) {
                      switch (listItem.status) {
                        case ListItemStatus.Checked: {
                          updateDoc<ListItemDocument>(listItem.ref, {
                            status: ListItemStatus.Indeterminate,
                          });
                          break;
                        }
                        case ListItemStatus.Indeterminate: {
                          updateDoc<ListItemDocument>(listItem.ref, {
                            status: ListItemStatus.Empty,
                          });
                          break;
                        }
                        default: {
                          updateDoc<ListItemDocument>(listItem.ref, {
                            status: ListItemStatus.Checked,
                          });
                          break;
                        }
                      }
                    }
                  }}
                  classNames={{
                    label: "cursor-pointer",
                    input: "cursor-pointer",
                  }}
                />
              );
            }
          )}
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
                  status: ListItemStatus.Empty,
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
                    Déplacer de board
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
                    openDeleteModal(list, listItems);
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
