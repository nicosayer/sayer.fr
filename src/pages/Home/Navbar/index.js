import { InputGroup } from "@blueprintjs/core";
import { Box } from "components/Box";
import { LogoutButton } from "components/LogoutButton";
import { UnlockButton } from "components/UnlockButton";

function Navbar() {
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
          <UnlockButton />
        </Box>
        <Box>
          <LogoutButton />
        </Box>
      </Box>
    </Box>
  );
}

export default Navbar;
