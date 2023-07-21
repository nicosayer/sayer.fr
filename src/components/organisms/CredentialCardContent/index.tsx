import {
  ActionIcon,
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
import CredentialPassword from "components/organisms/CredentialCardContent/CredentialPassword";
import CredentialUsername from "components/organisms/CredentialCardContent/CredentialUsername";
import EditCredentialModalContent from "components/organisms/CredentialCardContent/EditCredentialModalContent";
import MoveCredentialModalContent from "components/organisms/CredentialCardContent/MoveCredentialModalContent";
import { deleteDoc } from "firebase/firestore";
import { FC } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { CredentialDocument } from "types/firebase/collections";

export interface CredentialCardContentProps {
  credential: CredentialDocument;
}

const openEditModal = (credential: CredentialDocument) => {
  openModal({
    centered: true,
    title: "Modifier le mot de passe",
    children: <EditCredentialModalContent credential={credential} />,
  });
};

const openMoveModal = (credential: CredentialDocument) => {
  openModal({
    centered: true,
    title: "Déplacer le mot de passe",
    children: <MoveCredentialModalContent credential={credential} />,
  });
};

const openDeleteModal = (credential: CredentialDocument) => {
  openConfirmModal({
    title: "Supprimer le mot de passe",
    centered: true,
    children: (
      <Text size="sm">
        Voulez-vous vraiment supprimer ce mot de passe ? Cette action est
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
};

const CredentialCardContent: FC<CredentialCardContentProps> = ({
  credential,
}) => {
  const { boards } = useBoard();

  return (
    <Stack align="center">
      <Text weight={500}>{credential.name}</Text>
      <Stack spacing="xs">
        <Group position="center" spacing="xs">
          <Text size="sm">Identifiant :</Text>
          <CredentialUsername credential={credential} />
        </Group>
        <Group position="center" spacing="xs">
          <Text size="sm">Mot de passe :</Text>
          <CredentialPassword credential={credential} />
        </Group>
      </Stack>
      <Group className="w-full">
        <Button
          variant="light"
          className="flex-1"
          component="a"
          target="_blank"
          rel="noopener noreferrer"
          href={
            credential?.url
              ? credential?.url.startsWith("https://")
                ? credential?.url
                : `https://${credential?.url}`
              : `https://www.google.com/search?q=${credential.name}`
          }
        >
          Aller sur le site
        </Button>
        <CopyButton value={`${window.location.host}/${credential.ref?.path}`}>
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
                      openMoveModal(credential);
                    }}
                    icon={<IconSwitchHorizontal size={18} />}
                  >
                    Déplacer de board
                  </Menu.Item>
                ) : undefined}
                <Menu.Item
                  onClick={() => {
                    openEditModal(credential);
                  }}
                  icon={<IconEdit size={18} />}
                >
                  Modifier
                </Menu.Item>
                <Menu.Item
                  color="red"
                  onClick={() => {
                    openDeleteModal(credential);
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

export default CredentialCardContent;
