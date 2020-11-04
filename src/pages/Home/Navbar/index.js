import {
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  Popover,
  Tooltip,
} from "@blueprintjs/core";
import { Box } from "components/Box";
import { LogoutButton } from "components/LogoutButton";
import { useEncryption } from "hooks/useEncryption";

function Navbar() {
  const { key, setKey, locked } = useEncryption();

  return (
    <Box
      style={{
        width: "100%",
        backgroundColor: "white",
        borderBottom: "classic",
        borderColor: "lightgrey",
        display: "flex",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <Box
        style={{
          margin: "auto",
          width: "100%",
          maxWidth: "max",
          display: "flex",
          alignItems: "center",
        }}
      >
        <InputGroup
          autoFocus
          id="search-input"
          placeholder="Search"
          leftIcon="search"
          type="search"
          large
          fill
        />
        <Box style={{ marginRight: "10px", marginLeft: "10px" }}>
          <Popover
            popoverClassName={Classes.POPOVER_CONTENT_SIZING}
            content={
              <FormGroup
                label="Enter the encryption key"
                labelFor="encryption-key-input"
              >
                <InputGroup
                  id="encryption-key-input"
                  type="text"
                  value={key}
                  onChange={(event) => setKey(event?.target?.value)}
                  autoFocus={true}
                  rightElement={
                    <Tooltip content="Clear">
                      <Button icon="cross" minimal onClick={() => setKey("")} />
                    </Tooltip>
                  }
                />
              </FormGroup>
            }
          >
            <Tooltip
              intent={locked ? Intent.DANGER : Intent.SUCCESS}
              content={locked ? "Unlock items" : "Change the encryption key"}
            >
              <Button
                intent={locked ? Intent.DANGER : Intent.SUCCESS}
                large
                icon={locked ? "lock" : "unlock"}
              />
            </Tooltip>
          </Popover>
        </Box>
        <LogoutButton />
      </Box>
    </Box>
  );
}

export default Navbar;
