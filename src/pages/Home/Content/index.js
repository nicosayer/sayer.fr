import {
  Button,
  FormGroup,
  InputGroup,
  NonIdealState,
  Spinner,
} from "@blueprintjs/core";
import { Box } from "components/Box";
import { useListenData } from "hooks/useListenData";
import { sortBy } from "lodash/fp";
import User from "pages/Home/Content/User";
import { useEncryption } from "providers/EncryptionProvider";
import { useUser } from "providers/UserProvider";

function Home() {
  const { key, setKey, debouncedKey } = useEncryption();
  const { user } = useUser();

  const [users = [], loading] = useListenData({
    collection: "users",
    where: [["access", "array-contains", user.email]],
  });

  if (loading) {
    return (
      <Box style={{ marginTop: "40px" }}>
        <Spinner />
      </Box>
    );
  }

  if (!users.length) {
    return (
      <Box style={{ marginTop: "40px" }}>
        <NonIdealState icon="lock" title="No access" />
      </Box>
    );
  }

  return (
    <Box
      style={{
        padding: "10px",
        maxWidth: "max",
        margin: "auto",
      }}
    >
      {!debouncedKey && (
        <Box style={{ marginTop: "40px" }}>
          <NonIdealState
            icon="lock"
            title="Items are locked"
            description={
              <FormGroup
                label="Enter the encryption key"
                labelFor="encryption-key-input"
              >
                <InputGroup
                  autoCapitalize="none"
                  large
                  leftIcon="key"
                  id="encryption-key-input"
                  type="text"
                  value={key}
                  onChange={(event) => setKey(event?.target?.value)}
                  autoFocus
                  rightElement={
                    <Button disabled minimal>
                      {key && <Spinner size={17} />}
                    </Button>
                  }
                />
              </FormGroup>
            }
          />
        </Box>
      )}
      {sortBy("name", users).map((user) => (
        <User key={user.name} user={user} />
      ))}
    </Box>
  );
}

export default Home;
