import {
  ActionIcon,
  Card,
  CopyButton,
  Group,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { openConfirmModal, openModal } from "@mantine/modals";
import { IconEdit, IconLink, IconTrash } from "@tabler/icons";
import CredentialNameCopyButton from "components/molecules/CopyButton/CredentialName";
import CredentialPasswordCopyButton from "components/molecules/CopyButton/CredentialPassword";
import CredentialUsernameCopyButton from "components/molecules/CopyButton/CredentialUsername";
import { deleteDoc } from "firebase/firestore";
import { sortBy } from "lodash";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { sanitize } from "utils/string";
import EditCredentialModal from "./EditCredentialModal";

export interface CredentialsCardsProps {
  search: string;
}

const CredentialsCards: FC<CredentialsCardsProps> = ({ search }) => {
  const { board, credentials } = useBoard();

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
            <tr key={credential.id}>
              <td>
                <CredentialNameCopyButton credential={credential} />
              </td>
              <td>
                <CredentialUsernameCopyButton credential={credential} />
              </td>
              <td>
                <CredentialPasswordCopyButton credential={credential} />
              </td>
              <td>
                <Group position="right">
                  <CopyButton
                    value={`${process.env.REACT_APP_URL}/boards/${board?.id}/credentials/${credential.id}`}
                  >
                    {({ copied, copy }) => (
                      <Tooltip
                        label={copied ? "Lien copié" : "Copier le lien"}
                        withArrow
                      >
                        <ActionIcon
                          variant="subtle"
                          color={copied ? "teal" : "blue"}
                          onClick={copy}
                        >
                          <IconLink size={18} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
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
                              Cette action est définitive et irréversible.
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
