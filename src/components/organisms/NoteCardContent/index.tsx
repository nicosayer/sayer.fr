import {
  ActionIcon,
  Badge,
  Button,
  CopyButton,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";
import {
  IconCheck,
  IconDownload,
  IconEdit,
  IconEye,
  IconLink,
  IconTrash,
} from "@tabler/icons";
import { deleteDoc } from "firebase/firestore";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { NoteDocument } from "types/firebase/collections";
import { ALL_BOARDS_SLUG } from "utils/boards";
import { getColorFromString } from "utils/color";
import { formatDate } from "utils/dayjs";

export interface NoteCardContentProps {
  note: NoteDocument;
}

const NoteCardContent: FC<NoteCardContentProps> = ({ note }) => {
  const { boards } = useBoard();
  const is768Px = useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();

  const board = useMemo(() => {
    return boards?.find((board) => board.id === note.ref?.parent.parent?.id);
  }, [boards, note.ref?.parent.parent?.id]);

  console.log(board);

  const openDeleteModal = useCallback((note: NoteDocument) => {
    openConfirmModal({
      title: "Supprimer la note",
      centered: true,
      zIndex: 1000,
      children: (
        <Text size="sm">
          Voulez-vous vraiment supprimer la note ? Cette action est définitive
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
  }, []);

  return (
    <Stack>
      <Text fw={600} className="text-center">
        {note.name}
        {note.tag && (
          <Badge
            variant="dot"
            color={getColorFromString(note.tag)}
            className="absolute right-[16px]"
          >
            {note.tag}
          </Badge>
        )}
      </Text>
      <Group position="center" spacing="xs">
        <Badge size="lg" radius="sm" color="gray">
          {formatDate(note.date)}
        </Badge>
      </Group>
      <Group grow>
        <Button
          variant="light"
          onClick={() => {
            navigate(
              `/boards/${boards?.[0].id ?? ALL_BOARDS_SLUG}/notes/${note.id}`
            );
          }}
          leftIcon={<IconEye size={18} />}
        >
          Prévisualiser
        </Button>
        <Button
          variant="light"
          onClick={() => {}}
          leftIcon={<IconDownload size={18} />}
        >
          Télécharger
        </Button>
      </Group>
      <Group grow>
        <CopyButton
          value={`${process.env.REACT_APP_URL}/boards/${ALL_BOARDS_SLUG}/notes/${note.id}`}
        >
          {({ copied, copy }) =>
            is768Px ? (
              <Button
                fullWidth
                variant="subtle"
                size="xs"
                color={copied ? "teal" : "blue"}
                onClick={copy}
                leftIcon={
                  copied ? <IconCheck size={18} /> : <IconLink size={18} />
                }
              >
                {copied ? "Lien copié" : "Copier le lien"}
              </Button>
            ) : (
              <Tooltip
                label={copied ? "Lien copié" : "Copier le lien"}
                withArrow
              >
                <ActionIcon
                  color={copied ? "teal" : "blue"}
                  size="xs"
                  onClick={copy}
                >
                  {copied ? <IconCheck size={18} /> : <IconLink size={18} />}
                </ActionIcon>
              </Tooltip>
            )
          }
        </CopyButton>
        {is768Px ? (
          <Button
            size="xs"
            variant="subtle"
            onClick={() => {
              navigate(
                `/boards/${boards?.[0].id ?? ALL_BOARDS_SLUG}/notes/${note.id}`
              );
            }}
            leftIcon={<IconEdit size={18} />}
          >
            Modifier
          </Button>
        ) : (
          <Tooltip label="Modifier" withArrow>
            <ActionIcon
              size="xs"
              color="blue"
              onClick={() => {
                navigate(
                  `/boards/${boards?.[0].id ?? ALL_BOARDS_SLUG}/notes/${
                    note.id
                  }`
                );
              }}
            >
              <IconEdit size={18} />
            </ActionIcon>
          </Tooltip>
        )}
        {is768Px ? (
          <Button
            color="red"
            variant="subtle"
            size="xs"
            onClick={() => {
              openDeleteModal(note);
            }}
            leftIcon={<IconTrash size={18} />}
          >
            Supprimer
          </Button>
        ) : (
          <Tooltip label="Supprimer" withArrow>
            <ActionIcon
              size="xs"
              color="red"
              onClick={() => {
                openDeleteModal(note);
              }}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Stack>
  );
};

export default NoteCardContent;
