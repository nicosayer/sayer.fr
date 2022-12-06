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
import { openConfirmModal, openModal } from "@mantine/modals";
import { IconCheck, IconEdit, IconLink, IconTrash } from "@tabler/icons";
import CredentialName from "components/organisms/CredentialName";
import CredentialPassword from "components/organisms/CredentialPassword";
import CredentialUsername from "components/organisms/CredentialUsername";
import { deleteDoc } from "firebase/firestore";
import { FC, useCallback } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { CredentialDocument } from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import EditCredentialModal from "./EditCredentialModal";

export interface CredentialCardContentProps {
  credential: CredentialDocument;
}

const CredentialCardContent: FC<CredentialCardContentProps> = ({
  credential,
}) => {
  const { board } = useBoard();
  const is768Px = useMediaQuery("(min-width: 768px)");

  const openEditModal = useCallback(
    (credential: CredentialDocument) => {
      if (board) {
        return openModal({
          centered: true,
          zIndex: 1000,
          title: "Modifier le mot de passe",
          children: (
            <EditCredentialModal credential={credential} board={board} />
          ),
        });
      }
    },
    [board]
  );

  const openDeleteModal = useCallback((credential: CredentialDocument) => {
    openConfirmModal({
      title: "Supprimer le mot de passe",
      centered: true,
      zIndex: 1000,
      children: (
        <Text size="sm">
          Voulez-vous vraiment supprimer le mot de passe ? Cette action est
          définitive et irréversible.
        </Text>
      ),
      labels: { confirm: "Supprimer", cancel: "Annuler" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (credential.ref) {
          deleteDoc(credential.ref);
        }
      },
    });
  }, []);

  return (
    <Stack>
      <Group position="center">
        <CredentialName credential={credential} fw={600} />
        {credential.tag && (
          <Badge
            variant="dot"
            color={getColorFromString(credential.tag)}
            className="absolute right-[16px]"
          >
            {credential.tag}
          </Badge>
        )}
      </Group>
      <div className="grid gap-2">
        <Group position="center" spacing="xs">
          <div>Nom d'utilisateur :</div>
          <CredentialUsername credential={credential} />
        </Group>
        <Group position="center" spacing="xs">
          <div>Mot de passe :</div>
          <CredentialPassword credential={credential} />
        </Group>
      </div>
      <Group grow>
        <CopyButton
          value={`${process.env.REACT_APP_URL}/boards/${board?.id}/credentials/${credential.id}`}
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
            variant="subtle"
            size="xs"
            onClick={() => {
              openEditModal(credential);
            }}
            leftIcon={<IconEdit size={18} />}
          >
            Modifier
          </Button>
        ) : (
          <Tooltip label="Modifier" withArrow>
            <ActionIcon
              color="blue"
              size="xs"
              onClick={() => {
                openEditModal(credential);
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
              openDeleteModal(credential);
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
                openDeleteModal(credential);
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

export default CredentialCardContent;