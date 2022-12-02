import {
  ActionIcon,
  Button,
  Card,
  CopyButton,
  Group,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { openConfirmModal, openModal } from "@mantine/modals";
import { IconCopy, IconEdit, IconExternalLink, IconTrash } from "@tabler/icons";
import { deleteDoc } from "firebase/firestore";
import { sortBy } from "lodash";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { formatPassword, sanitize } from "utils/string";
import EditCredentialModal from "./EditCredentialModal";

export interface CredentialsCardsProps {
  search: string;
}

const CredentialsCards: FC<CredentialsCardsProps> = ({ search }) => {
  const { credentials } = useBoard();

  const filteredCredentials = useMemo(() => {
    return sortBy(
      (credentials ?? []).filter((credential) => {
        return sanitize(String(credential.name)).indexOf(sanitize(search)) > -1;
      }),
      (credential) => sanitize(credential.name ?? "")
    );
  }, [credentials, search]);

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
          {filteredCredentials.map((credential) => (
            <tr key={credential.id} className="cursor-pointer">
              <td>
                {credential.url ? (
                  <Tooltip label="Aller sur le site" withArrow>
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
                  </Tooltip>
                ) : (
                  <Button variant="subtle" compact color="dark">
                    {credential.name}
                  </Button>
                )}
              </td>
              <td>
                <Tooltip label="Copier" withArrow>
                  <span>
                    <CopyButton value={String(credential.username)}>
                      {({ copied, copy }) => (
                        <Button
                          variant="subtle"
                          compact
                          color={copied ? "teal" : "dark"}
                          onClick={copy}
                          rightIcon={<IconCopy size={18} />}
                        >
                          {credential.username}
                        </Button>
                      )}
                    </CopyButton>
                  </span>
                </Tooltip>
              </td>
              <td>
                <Tooltip label="Copier" withArrow>
                  <span>
                    <CopyButton value={String(credential.password)}>
                      {({ copied, copy }) => (
                        <Button
                          variant="subtle"
                          compact
                          color={copied ? "teal" : "dark"}
                          onClick={copy}
                          rightIcon={<IconCopy size={18} />}
                        >
                          {formatPassword(String(credential.password))}
                        </Button>
                      )}
                    </CopyButton>
                  </span>
                </Tooltip>
              </td>
              <td>
                <Group>
                  <Tooltip label="Modifier" withArrow>
                    <ActionIcon
                      color="blue"
                      variant="subtle"
                      onClick={() => {
                        openModal({
                          centered: true,
                          title: "Modifier le mot de passe",
                          children: (
                            <EditCredentialModal credential={credential} />
                          ),
                        });
                      }}
                    >
                      <IconEdit size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Supprimer" withArrow>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => {
                        openConfirmModal({
                          title: "Supprimer le mot de passe",
                          centered: true,
                          children: (
                            <Text size="sm">
                              Voulez-vous vraiment supprimer le mot de passe ?
                              Cette action est définitive et irrémédiable.
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
                  </Tooltip>
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
