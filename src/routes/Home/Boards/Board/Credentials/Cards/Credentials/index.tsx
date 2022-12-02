import {
  ActionIcon,
  Button,
  Card,
  CopyButton,
  Group,
  Table,
  Text,
} from "@mantine/core";
import { openConfirmModal, openModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconCopy, IconEdit, IconExternalLink, IconPencil, IconTrash } from "@tabler/icons";
import { deleteDoc } from "firebase/firestore";
import { sortBy } from "lodash";
import { FC } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { formatPassword, sanitize } from "utils/string";
import EditCredentialModal from "../../EditCredentialModal";

const CredentialsCards: FC = () => {
  const { credentials } = useBoard();

  return (
    <Card withBorder>
      <Table>
        <thead>
          <tr>
            <th>Site web</th>
            <th>Nom d'utilisateur</th>
            <th>Mot de passe</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortBy(credentials ?? [], credential => sanitize(credential.name ?? '')).map((credential) => (
            <tr key={credential.id} className="cursor-pointer">
              <td>
                {credential.url ? (
                  <Button
                    variant="subtle"
                    compact
                    color="dark"
                    rightIcon={
                      credential.url ? (
                        <IconExternalLink size={18} />
                      ) : undefined
                    }
                    component="a"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={credential.url}
                  >
                    {credential.name}
                  </Button>
                ) : (
                  <Button variant="subtle" compact color="dark">
                    {credential.name}
                  </Button>
                )}
              </td>
              <td>
                <CopyButton value={String(credential.username)}>
                  {({ copied, copy }) => (
                    <Button
                      variant="subtle"
                      compact
                      color={copied ? "teal" : "dark"}
                      onClick={() => {
                        copy();
                        showNotification({
                          title: "Copié avec succès",
                          message:
                            "Le nom d'utilisateur a été copié dans le presse-papiers",
                        });
                      }}
                      rightIcon={<IconCopy size={18} />}
                    >
                      {credential.username}
                    </Button>
                  )}
                </CopyButton>
              </td>
              <td>
                <CopyButton value={String(credential.password)}>
                  {({ copied, copy }) => (
                    <Button
                      variant="subtle"
                      compact
                      color={copied ? "teal" : "dark"}
                      onClick={() => {
                        copy();
                        showNotification({
                          title: "Copié avec succès",
                          message:
                            "Le mot de passe a été copié dans le presse-papiers",
                        });
                      }}
                      rightIcon={<IconCopy size={18} />}
                    >
                      {formatPassword(String(credential.password))}
                    </Button>
                  )}
                </CopyButton>
              </td>
              <td>
                <Group>
                  <ActionIcon
                    color="blue"
                    variant="subtle"
                    onClick={() => {
                      openModal({
                        centered: true,
                        title: "Modifier le mot de passe",
                        children: <EditCredentialModal credential={credential} />,
                      });
                    }}
                  >
                    <IconEdit size={18} />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => {
                      openConfirmModal({
                        title: "Supprimer le mot de passe",
                        centered: true,
                        children: (
                          <Text size="sm">
                            Voulez-vous vraiment supprimer le mot de passe ? Cette
                            action est définitive et irrémédiable.
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
                    }}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default CredentialsCards;
