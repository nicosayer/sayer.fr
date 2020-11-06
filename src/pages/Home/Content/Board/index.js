import { Card, Classes, H4, NonIdealState } from "@blueprintjs/core";
import { Box } from "components/Box";
import { useListenData } from "hooks/useListenData";
import { useCallback, useMemo } from "react";
import Credential from "pages/Home/Content/Board/Credential";
import { caseInsensitiveSortBy, searchInString } from "utils";
import { NewItemButton } from "components/NewItemButton";
import { useEncryption } from "providers/EncryptionProvider";
import Document from "pages/Home/Content/Board/Document";
import { useSearch } from "providers/SearchProvider";
import { EditBoardButton } from "components/EditBoardButton";

function Board({ board }) {
  const { search } = useSearch();
  const { test, key } = useEncryption();
  const [credentials = [], loadingCredentials] = useListenData({
    src: board.ref,
    collection: "credentials",
    where: [["password", "!=", false]],
  });
  const [documents = [], loadingDocuments] = useListenData({
    src: board.ref,
    collection: "documents",
    where: [["path", "!=", false]],
  });

  const loading = useMemo(() => {
    return loadingCredentials || loadingDocuments;
  }, [loadingCredentials, loadingDocuments]);

  const filterItems = useCallback(
    (items, { searchable, encrypted }) => {
      return items.filter((item) => {
        return (
          test(item[encrypted]) &&
          (!search || searchInString(item[searchable], search))
        );
      });
    },
    [search, test]
  );

  const filteredCredentials = useMemo(() => {
    return filterItems(credentials, {
      searchable: "label",
      encrypted: "password",
    });
  }, [credentials, filterItems]);

  const filteredDocuments = useMemo(() => {
    return filterItems(documents, {
      searchable: "label",
      encrypted: "path",
    });
  }, [documents, filterItems]);

  const resultsCount = useMemo(() => {
    return filteredCredentials.length + filteredDocuments.length;
  }, [filteredCredentials.length, filteredDocuments.length]);

  if (!key || (search && !resultsCount)) {
    return null;
  }

  return (
    <Box key={board.name} style={{ marginBottom: "40px" }}>
      <H4>
        <Box style={{ display: "flex", alignItems: "center" }}>
          {board.name}
          <Box style={{ marginLeft: "10px", marginRight: "10px" }}>
            <EditBoardButton board={board} />
          </Box>
          <NewItemButton board={board} />
        </Box>
      </H4>

      <Box style={{ marginTop: "10px" }}>
        <Card>
          <Box>
            {!resultsCount && (
              <NonIdealState
                className={loading && Classes.SKELETON}
                icon="path-search"
                title="No items"
              />
            )}
            {Boolean(filteredCredentials.length) &&
              caseInsensitiveSortBy(filteredCredentials, "label").map((credential) => (
                <Box
                  key={
                    credential.label + credential.username + credential.password
                  }
                  style={{ marginBottom: "20px" }}
                >
                  <Credential credential={credential} />
                </Box>
              ))}
            {Boolean(filteredDocuments.length) &&
              caseInsensitiveSortBy(filteredDocuments, "label").map(
                (document) => (
                  <Box
                    key={document.label + document.path}
                    style={{ marginBottom: "20px" }}
                  >
                    <Document document={document} />
                  </Box>
                )
              )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

export default Board;
