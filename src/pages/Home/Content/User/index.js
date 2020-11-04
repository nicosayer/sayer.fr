import { Card, H4, NonIdealState } from "@blueprintjs/core";
import { Box } from "components/Box";
import { useListenData } from "hooks/useListenData";
import { useEffect, useMemo, useState } from "react";
import { sortBy } from "lodash/fp";
import Credential from "pages/Home/Content/User/Credential";
import { searchInString } from "utils";
import { NewItemButton } from "components/NewItemButton";
import { useEncryption } from "hooks/useEncryption";
import Document from "pages/Home/Content/User/Document";

function User({ user }) {
  const [search, setSearch] = useState("");
  const { test } = useEncryption();
  const [credentials = []] = useListenData({
    src: user.ref,
    collection: "credentials",
  });
  const [documents = []] = useListenData({
    src: user.ref,
    collection: "documents",
  });

  useEffect(() => {
    const handleSearch = (event) => {
      setSearch(event?.target?.value);
    };

    document
      .getElementById("search-input")
      ?.addEventListener("input", handleSearch);

    return () => {
      document
        .getElementById("search-input")
        ?.removeEventListener("input", handleSearch);
    };
  }, []);

  const filteredCredentials = useMemo(() => {
    return credentials.filter((credential) => {
      return (
        credential.label &&
        credential.username &&
        credential.password &&
        test(credential.password) &&
        (!search || searchInString(credential.label, search))
      );
    });
  }, [credentials, search, test]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      return (
        document.label &&
        document.name &&
        document.path &&
        test(document.path) &&
        (!search || searchInString(document.label, search))
      );
    });
  }, [documents, search, test]);

  const resultsCount = useMemo(() => {
    return filteredCredentials.length + filteredDocuments.length;
  }, [filteredCredentials.length, filteredDocuments.length]);

  if (search && !resultsCount) {
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
