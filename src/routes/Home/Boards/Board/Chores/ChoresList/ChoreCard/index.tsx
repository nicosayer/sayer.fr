import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import { openConfirmModal, openModal } from "@mantine/modals";
import {
  IconDotsVertical,
  IconEdit,
  IconSwitchHorizontal,
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { deleteDoc, updateDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useMemo } from "react";
import EditChoreModalContent from "routes/Home/Boards/Board/Chores/ChoresList/ChoreCard/EditChoreModalContent";
import MoveChoreModalContent from "routes/Home/Boards/Board/Chores/ChoresList/ChoreCard/MoveChoreModalContent";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { ChoreDocument, ChoreUnit } from "types/firebase/collections";
import { formatDate } from "utils/dayjs";

export interface ChoreCardsPropContent {
  chore: ChoreDocument & {
    previousDate: string;
    nextDate: string;
    nextDoneDate: string;
  };
}

const openEditModal = (chore: ChoreDocument) => {
  openModal({
    centered: true,
    title: "Modifier la tâche",
    children: <EditChoreModalContent chore={chore} />,
  });
};

const openMoveModal = (chore: ChoreDocument) => {
  openModal({
    centered: true,
    title: "Déplacer la tâche",
    children: <MoveChoreModalContent chore={chore} />,
  });
};

const openDeleteModal = (chore: ChoreDocument) => {
  openConfirmModal({
    title: "Supprimer la tâche",
    centered: true,
    children: (
      <Text size="sm">
        Voulez-vous vraiment supprimer cette tâche ? Cette action est définitive
        et irréversible.
      </Text>
    ),
    labels: { confirm: "Supprimer", cancel: "Annuler" },
    confirmProps: { color: "red" },
    onConfirm: () => {
      if (chore.ref) {
        deleteDoc(chore.ref);
      }
    },
  });
};

const ChoreCard: FC<ChoreCardsPropContent> = ({ chore }) => {
  const { boards } = useBoard();
  const [loading, start, stop] = useBooleanState();

  const badgeContent = useMemo(() => {
    const frequency = chore.frequency === 1 ? "" : chore.frequency;

    switch (chore.unit) {
      case ChoreUnit.Day:
        return `Tous les ${frequency} jours`;
      case ChoreUnit.Week:
        return `Toutes les ${frequency} semaines`;
      case ChoreUnit.Month:
        return `Tous les ${frequency} mois`;
    }
  }, [chore.frequency, chore.unit]);

  return (
    <Card
      withBorder
      className={chore.nextDoneDate > formatDate() ? "opacity-50" : ""}
    >
      <Stack align="center">
        <Stack align="center" spacing="xs">
          <Group spacing="xs">
            <Text weight={500}>{chore.name}</Text>
            <Badge radius="sm" color="gray">
              {formatDate(chore.nextDoneDate, "D MMM")}
            </Badge>
          </Group>
          <Badge radius="sm" color="gray">
            {badgeContent}
          </Badge>
        </Stack>
        <Group className="w-full">
          {chore.nextDoneDate > formatDate() ? (
            <Button
              variant="light"
              className="flex-1"
              loading={loading}
              onClick={() => {
                if (chore.ref) {
                  start();
                  updateDoc<ChoreDocument>(chore.ref, {
                    lastDoneDate: formatDate(
                      dayjs(chore.previousDate).subtract(1, "day")
                    ),
                  }).finally(stop);
                }
              }}
            >
              Tâche à refaire
            </Button>
          ) : (
            <Button
              variant="light"
              className="flex-1"
              loading={loading}
              onClick={() => {
                if (chore.ref) {
                  start();
                  updateDoc<ChoreDocument>(chore.ref, {
                    lastDoneDate: formatDate(),
                  }).finally(stop);
                }
              }}
            >
              Tâche effectuée
            </Button>
          )}
          <Menu shadow="md" width={200} withinPortal>
            <Menu.Target>
              <ActionIcon variant="light" radius="md" size={36}>
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              {(boards?.length ?? 0) > 1 ? (
                <Menu.Item
                  onClick={() => {
                    openMoveModal(chore);
                  }}
                  icon={<IconSwitchHorizontal size={18} />}
                >
                  Déplacer
                </Menu.Item>
              ) : undefined}
              <Menu.Item
                onClick={() => {
                  openEditModal(chore);
                }}
                icon={<IconEdit size={18} />}
              >
                Modifier
              </Menu.Item>
              <Menu.Item
                color="red"
                onClick={() => {
                  openDeleteModal(chore);
                }}
                icon={<IconTrash size={18} />}
              >
                Supprimer
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Stack>
    </Card>
  );
};

export default ChoreCard;
