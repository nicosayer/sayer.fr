import { InputGroup } from "@blueprintjs/core";
import { Box } from "components/Box";
import { LogoutButton } from "components/LogoutButton";

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
        <Box style={{ marginLeft: "10px" }}>
          <LogoutButton />
        </Box>
      </Box>
    </Box>
  );
}

export default Navbar;
