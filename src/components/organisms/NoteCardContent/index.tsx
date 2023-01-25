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
  IconEdit,
  IconEye,
  IconLink,
  IconTrash,
} from "@tabler/icons";
import { deleteDoc } from "firebase/firestore";
import { FC, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NoteDocument } from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import { formatDate } from "utils/dayjs";

export interface NoteCardContentProps {
  note: NoteDocument;
}

const NoteCardContent: FC<NoteCardContentProps> = ({ note }) => {
  const is768Px = useMediaQuery("(min-width: 768px)");
  const { boardId } = useParams();
  const navigate = useNavigate();

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
        {note.tag && is768Px && (
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
          {formatDate(note.date, "D MMM YYYY")}
        </Badge>
      </Group>
      <Group grow>
        <Button
          variant="light"
          onClick={() => {
            navigate(`/boards/${boardId}/notes/${note.id}`);
          }}
          leftIcon={<IconEye size={18} />}
        >
          Prévisualiser
        </Button>
      </Group>
      <div className="grid grid-cols-3">
        <div className="m-auto">
          <CopyButton value={`${window.location.host}/${note.ref?.path}`}>
            {({ copied, copy }) =>
              is768Px ? (
                <Button
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
                    onClick={copy}
                    className="m-auto"
                  >
                    {copied ? <IconCheck size={18} /> : <IconLink size={18} />}
                  </ActionIcon>
                </Tooltip>
              )
            }
          </CopyButton>
        </div>
        <div className="m-auto">
          {is768Px ? (
            <Button
              size="xs"
              variant="subtle"
              onClick={() => {
                navigate(`/boards/${boardId}/notes/${note.id}`);
              }}
              leftIcon={<IconEdit size={18} />}
            >
              Modifier
            </Button>
          ) : (
            <Tooltip label="Modifier" withArrow>
              <ActionIcon
                color="blue"
                className="m-auto"
                onClick={() => {
                  navigate(`/boards/${boardId}/notes/${note.id}`);
                }}
              >
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </div>
        <div className="m-auto">
          {is768Px ? (
            <Button
              size="xs"
              color="red"
              variant="subtle"
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
                color="red"
                className="m-auto"
                onClick={() => {
                  openDeleteModal(note);
                }}
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </div>
      </div>
    </Stack>
  );
};

export default NoteCardContent;
