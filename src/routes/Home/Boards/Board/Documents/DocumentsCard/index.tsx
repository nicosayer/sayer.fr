import { ActionIcon, Card, Group, Table, Text, Tooltip } from "@mantine/core";
import { openConfirmModal, openModal } from "@mantine/modals";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons";
import { deleteDoc } from "firebase/firestore";
import { sortBy } from "lodash";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { sanitize } from "utils/string";
import EditDocumentModal from "./EditDocumentModal";

export interface DocumentsCardsProps {
  search: string;
}

const DocumentsCards: FC<DocumentsCardsProps> = ({ search }) => {
  const { documents } = useBoard();

  const filteredDocuments = useMemo(() => {
    return sortBy(
      (documents ?? []).filter((document) => {
        return sanitize(String(document.type)).indexOf(sanitize(search)) > -1;
      }),
      (document) => sanitize(document.type ?? "")
    );
  }, [documents, search]);

  return (
    <Card withBorder>
      <Table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Propriétaire</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredDocuments.map((document) => (
            <tr key={document.id} className="cursor-pointer">
              <td>{document.type}</td>
              <td>{document.owner}</td>
              <td>
                <Group position="right">
                  <Tooltip label="Ouvrir">
                    <ActionIcon color="blue">
                      <IconEye size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Modifier" withArrow>
                    <ActionIcon
                      color="blue"
                      variant="subtle"
                      onClick={() => {
                        openModal({
                          centered: true,
                          title: "Modifier le document",
                          children: <EditDocumentModal document={document} />,
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
                          title: "Supprimer le document",
                          centered: true,
                          children: (
                            <Text size="sm">
                              Voulez-vous vraiment supprimer le document ? Cette
                              action est définitive et irrémédiable.
                            </Text>
                          ),
                          labels: { confirm: "Supprimer", cancel: "Annuler" },
                          confirmProps: { color: "red" },
                          onConfirm: () => {
                            if (document.ref) {
                              deleteDoc(document.ref);
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

export default DocumentsCards;
