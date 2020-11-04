import { Card, H4, NonIdealState } from "@blueprintjs/core";
import { Box } from "components/Box";
import { useListenData } from "hooks/useListenData";
import { useEffect, useMemo, useState } from "react";
import { sortBy } from "lodash/fp";
import Credential from "pages/Home/Content/User/Credential";
import { sanitize } from "utils";
import { NewCredentialButton } from "components/NewCredentialButton";
import { useEncryption } from "hooks/useEncryption";

function User({ user }) {
  const [search, setSearch] = useState("");
  const { test } = useEncryption();

  const [credentials = []] = useListenData({
    src: user.ref,
    collection: "credentials",
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
        (!search || sanitize(credential.label).search(sanitize(search)) > -1)
      );
    });
  }, [credentials, search, test]);

  if (search && !filteredCredentials.length) {
    return null;
  }

  return (
    <Box key={user.name} style={{ marginBottom: "40px" }}>
      <H4>
        {user.name}
        <Box as="span" style={{ marginLeft: "10px" }}>
          <NewCredentialButton user={user} />
        </Box>
      </H4>

      <Box style={{ marginTop: "10px" }}>
        <Card>
          <Box>
            {filteredCredentials.length ? (
              sortBy("label", filteredCredentials).map((credential, index) => (
                <Box
                  key={
                    credential.label + credential.username + credential.password
                  }
                  style={{ marginTop: index > 0 ? "20px" : undefined }}
                >
                  <Credential credential={credential} />
                </Box>
              ))
            ) : (
              <NonIdealState icon="path-search" title="No items" />
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

export default User;
