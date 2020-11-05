import { Card, H4, NonIdealState } from "@blueprintjs/core";
import { Box } from "components/Box";
import { useListenData } from "hooks/useListenData";
import { useCallback, useMemo } from "react";
import { sortBy } from "lodash/fp";
import Credential from "pages/Home/Content/User/Credential";
import { searchInString } from "utils";
import { NewItemButton } from "components/NewItemButton";
import { useEncryption } from "providers/EncryptionProvider";
import Document from "pages/Home/Content/User/Document";
import { useSearch } from "providers/SearchProvider";

function User({ user }) {
  const { search } = useSearch();
  const { test, debouncedKey } = useEncryption();
  const [credentials = []] = useListenData({
    src: user.ref,
    collection: "credentials",
    where: [["password", "!=", false]],
  });
  const [documents = []] = useListenData({
    src: user.ref,
    collection: "documents",
    where: [["path", "!=", false]],
  });

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

  if (!debouncedKey || (search && !resultsCount)) {
    return null;
  }

  return (
    <Box key={user.name} style={{ marginBottom: "40px" }}>
      <H4>
        {user.name}
        <Box as="span" style={{ marginLeft: "10px" }}>
          <NewItemButton user={user} />
        </Box>
      </H4>

      <Box style={{ marginTop: "10px" }}>
        <Card>
          <Box>
            {!resultsCount && (
              <NonIdealState icon="path-search" title="No items" />
            )}
            {Boolean(filteredCredentials.length) &&
              sortBy("label", filteredCredentials).map((credential) => (
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
              sortBy("label", filteredDocuments).map((document) => (
                <Box
                  key={document.label + document.path}
                  style={{ marginBottom: "20px" }}
                >
                  <Document document={document} />
                </Box>
              ))}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

export default User;
