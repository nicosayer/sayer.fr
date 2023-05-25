import {
  ActionIcon,
  Badge,
  Button,
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
import { deleteDoc } from "firebase/firestore";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { NoteDocument } from "types/firebase/collections";
import { formatDate } from "utils/dayjs";
import MoveNoteModalContent from "./MoveNoteModalContent";

export interface NoteCardContentProps {
  note: NoteDocument;
}

const openMoveModal = (note: NoteDocument) => {
  openModal({
    centered: true,
    title: "Déplacer la note",
    children: <MoveNoteModalContent note={note} />,
  });
};

const openDeleteModal = (note: NoteDocument) => {
  openConfirmModal({
    title: "Supprimer la note",
    centered: true,
    children: (
      <Text size="sm">
        Voulez-vous vraiment supprimer cette note ? Cette action est définitive
        et irréversible.
      </Text>
    ),
    labels: { confirm: "Supprimer", cancel: "Annuler" },
    confirmProps: { color: "red" },
    onConfirm: () => {
      if (note.ref) {
        deleteDoc(note.ref);
      }
    },
  });
};

const NoteCardContent: FC<NoteCardContentProps> = ({ note }) => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { boards } = useBoard();

  return (
    <Stack align="center">
      <Group spacing="xs">
        <Text weight={500}>{note.name}</Text>
        <Badge radius="sm" color="gray">
          {formatDate(note.date, "D MMM YYYY")}
        </Badge>
      </Group>

      <Group className="w-full">
        <Button
          variant="light"
          className="flex-1"
          onClick={() => {
            navigate(`/boards/${boardId}/notes/${note.id}`);
          }}
        >
          Modifier
        </Button>
        <CopyButton value={`${window.location.host}/${note.ref?.path}`}>
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
                      openMoveModal(note);
                    }}
                    icon={<IconSwitchHorizontal size={18} />}
                  >
                    Déplacer
                  </Menu.Item>
                ) : undefined}
                <Menu.Item
                  onClick={() => {
                    navigate(`/boards/${boardId}/notes/${note.id}`);
                  }}
                  icon={<IconEdit size={18} />}
                >
                  Modifier
                </Menu.Item>
                <Menu.Item
                  color="red"
                  onClick={() => {
                    openDeleteModal(note);
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

export default NoteCardContent;
