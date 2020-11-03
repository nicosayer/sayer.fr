import { Button, Card, Collapse, Intent } from "@blueprintjs/core";
import { Box } from "components/Box";
import { useReadData } from "hooks/useReadData";
import { useEffect, useMemo, useState } from "react";
import { sortBy } from "lodash/fp";
import Credential from "pages/Home/Content/User/Credential";
import { sanitize } from "utils";

function User({ user }) {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");

  const [credentials = []] = useReadData({
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
      <Button
        intent={Intent.PRIMARY}
        large
        rightIcon={open ? "chevron-down" : "chevron-right"}
        onClick={() => {
          setOpen(!open);
        }}
      >
        {user.name}
      </Button>
      <Box as="span" style={{ marginLeft: "10px" }}>
        <Button intent={Intent.PRIMARY} large icon="plus" />
      </Box>

      <Collapse isOpen={open} keepChildrenMounted>
        <Box style={{ marginTop: "10px" }}>
          <Card>
            <Box>
              {sortBy("label", filteredCredentials).map((credential, index) => (
                <Box
                  key={credential.label}
                  style={{ marginTop: index > 0 ? "20px" : undefined }}
                >
                  <Credential credential={credential} />
                </Box>
              ))}
            </Box>
          </Card>
        </Box>
      </Collapse>
    </Box>
  );
}

export default User;
