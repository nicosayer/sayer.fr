import {
  ActionIcon,
  Button,
  Card,
  CopyButton,
  Table,
  Text,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconCopy, IconExternalLink, IconTrash } from "@tabler/icons";
import { deleteDoc } from "firebase/firestore";
import { FC } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { formatPassword } from "utils/string";

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
          {(credentials ?? []).map((credential) => (
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
                    {credential.name || credential.url}
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
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default CredentialsCards;
