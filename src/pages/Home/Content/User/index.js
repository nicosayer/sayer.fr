import { Button, Card, H4, Intent, Tooltip } from "@blueprintjs/core";
import { Box } from "components/Box";
import { useListenData } from "hooks/useListenData";
import { useEffect, useMemo, useState } from "react";
import { sortBy } from "lodash/fp";
import Credential from "pages/Home/Content/User/Credential";
import { sanitize } from "utils";
import NewCredential from "pages/Home/Content/User/NewCredential";

function User({ user }) {
  const [isNewCredentialOpen, setIsNewCredentialOpen] = useState(false);
  const [search, setSearch] = useState("");

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
        (!search ||
          sanitize(credential.label).search(sanitize(search)) > -1 ||
          sanitize(credential.username).search(sanitize(search)) > -1 ||
          sanitize(user.name).search(sanitize(search)) > -1)
      );
    });
  }, [credentials, search, user.name]);

  if (!filteredCredentials.length) {
    return null;
  }

  return (
    <Box key={user.name} style={{ marginBottom: "40px" }}>
      <H4>
        {user.name}
        <Box as="span" style={{ marginLeft: "10px" }}>
          <Tooltip intent={Intent.PRIMARY} content="Add new item">
            <Button
              intent={Intent.PRIMARY}
              large
              icon="plus"
              onClick={() => setIsNewCredentialOpen(true)}
            />
          </Tooltip>
        </Box>
      </H4>

      <Box style={{ marginTop: "10px" }}>
        <Card>
          <Box>
            {sortBy("label", filteredCredentials).map((credential, index) => (
              <Box
                key={
                  credential.label + credential.username + credential.password
                }
                style={{ marginTop: index > 0 ? "20px" : undefined }}
              >
                <Credential credential={credential} />
              </Box>
            ))}
          </Box>
        </Card>
      </Box>
      <NewCredential
        isOpen={isNewCredentialOpen}
        onClose={() => setIsNewCredentialOpen(false)}
        user={user}
      />
    </Box>
  );
}

export default User;
