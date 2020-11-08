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
import { useRoles } from "hooks/useRoles";
import { RemoveFromViewersButton } from "components/RemoveFromViewersButton";

function Board({ board }) {
  const { search } = useSearch();
  const { test, key } = useEncryption();
  const { isEditorOf, isViewerOf } = useRoles();
  const isEditor = useMemo(() => isEditorOf(board), [isEditorOf, board]);
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

  const itemsCount = useMemo(() => {
    return credentials.length + documents.length;
  }, [credentials.length, documents.length]);

  const filteredItemsCount = useMemo(() => {
    return filteredCredentials.length + filteredDocuments.length;
  }, [filteredCredentials.length, filteredDocuments.length]);

  if (!key || (search && !filteredItemsCount)) {
    return null;
  }

  return (
    <Box style={{ marginBottom: "40px" }}>
      <H4>
        <Box style={{ display: "flex", alignItems: "center" }}>
          {board.name}
          {isEditor && (
            <Box style={{ marginLeft: "10px" }}>
              <EditBoardButton board={board} />
            </Box>
          )}
          {isEditor && (
            <Box style={{ marginLeft: "10px" }}>
              <NewItemButton board={board} />
            </Box>
          )}
          {isViewerOf(board) && (
            <Box style={{ marginLeft: "10px" }}>
              <RemoveFromViewersButton board={board} />
            </Box>
          )}
        </Box>
      </H4>

      <Box style={{ marginTop: "10px" }}>
        <Card>
          <Box>
            {!filteredItemsCount && (
              <NonIdealState
                className={loading && Classes.SKELETON}
                icon="path-search"
                title={itemsCount ? "No results" : "No items"}
              />
            )}
            {Boolean(filteredCredentials.length) &&
              caseInsensitiveSortBy(filteredCredentials, "label").map(
                (credential) => (
                  <Box key={credential.uid} style={{ marginBottom: "20px" }}>
                    <Credential credential={credential} isEditor={isEditor} />
                  </Box>
                )
              )}
            {Boolean(filteredDocuments.length) &&
              caseInsensitiveSortBy(filteredDocuments, "label").map(
                (document) => (
                  <Box
                    key={document.uid}
                    style={{ marginBottom: "20px" }}
                  >
                    <Document document={document} isEditor={isEditor} />
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
