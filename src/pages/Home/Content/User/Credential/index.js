import { Button, Callout, H4 } from "@blueprintjs/core";
import { Box } from "components/Box";
import { useState } from "react";

function Credential({ credential }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Box style={{ textAlign: "center" }}>
        <H4>
          {credential.url ? (
            <a href={credential.url}>{credential.label}</a>
          ) : (
            credential.label
          )}
        </H4>
      </Box>
      <Callout>
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Button
              outlined
              rightIcon="duplicate"
              onClick={() => {
                navigator.clipboard.writeText(credential.username);
              }}
            >
              <Box style={{ fontFamily: "monospace" }}>
                {credential.username}
              </Box>
            </Button>
          </div>
          <Box style={{ textAlign: "right" }}>
            <Button
              outlined
              rightIcon="duplicate"
              onClick={() => {
                navigator.clipboard.writeText(credential.password);
              }}
            >
              <Box style={{ fontFamily: "monospace" }}>
                {visible
                  ? credential.password
                  : credential.password.replace(/./g, "•")}
              </Box>
            </Button>
            <Box as="span" style={{ marginLeft: "10px" }}>
              <Button
                outlined
                icon={visible ? "eye-off" : "eye-open"}
                onClick={() => {
                  setVisible(!visible);
                }}
              />
            </Box>
          </Box>
        </Box>
      </Callout>
    </>
  );
}

export default Credential;
