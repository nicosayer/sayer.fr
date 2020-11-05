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
import Board from "pages/Home/Content/Board";
import { useEncryption } from "providers/EncryptionProvider";
import { useUser } from "providers/UserProvider";
import { useCallback, useEffect, useState } from "react";

function Home() {
  const [tempKey, setTempKey] = useState("");
  const { key, setKey } = useEncryption();
  const { user } = useUser();

  useEffect(() => {
    if (key) {
      setTempKey("");
    }
  }, [key]);

  const handleSubmit = useCallback(() => {
    setKey(tempKey);
  }, [tempKey, setKey]);

  const [boards = [], loading] = useListenData({
    collection: "boards",
    where: [["access", "array-contains", user.email]],
  });

  if (loading) {
    return (
      <Box style={{ marginTop: "40px" }}>
        <Spinner />
      </Box>
    );
  }

  if (!boards.length) {
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
      {!key && (
        <Box style={{ marginTop: "40px" }}>
          <NonIdealState
            icon="lock"
            title="Items are locked"
            description={
              <FormGroup
                label="Enter the encryption key"
                labelFor="temp-encryption-key-input"
              >
                <InputGroup
                  autoCapitalize="none"
                  onKeyDown={({ key }) => {
                    if (key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  large
                  leftIcon="key"
                  id="temp-encryption-key-input"
                  type="text"
                  value={tempKey}
                  onChange={(event) => setTempKey(event?.target?.value)}
                  autoFocus
                  rightElement={
                    <Button
                      icon="arrow-right"
                      onClick={() => {
                        handleSubmit();
                      }}
                    />
                  }
                />
              </FormGroup>
            }
          />
        </Box>
      )}
      {sortBy("name", boards).map((user) => (
        <Board key={user.name} user={user} />
      ))}
    </Box>
  );
}

export default Home;
