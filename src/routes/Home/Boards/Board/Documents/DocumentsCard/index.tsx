import { Card, Table } from "@mantine/core";
import { sortBy } from "lodash";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { sanitize } from "utils/string";
import ActionsColumns from "./Columns/Actions";

export interface DocumentsCardsProps {
  search: string;
}

const DocumentsCards: FC<DocumentsCardsProps> = ({ search }) => {
  const { documents } = useBoard();

  const filteredDocuments = useMemo(() => {
    return sortBy(
      (documents ?? []).filter((document) => {
        return (
          sanitize(String(document.type)).indexOf(sanitize(search)) > -1 ||
          sanitize(String(document.owner)).indexOf(sanitize(search)) > -1
        );
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
            <tr key={document.id}>
              <td><div className="max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">{document.type}</div></td>
              <td><div className="max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">{document.owner}</div></td>
              <ActionsColumns document={document} />
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default DocumentsCards;
