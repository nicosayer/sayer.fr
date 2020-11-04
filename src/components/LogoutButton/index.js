import { Button, Intent } from "@blueprintjs/core";
import { useIsMobile } from "hooks/useIsMobile";
import { useEncryption } from "providers/EncryptionProvider";
import React from "react";
import { logout } from "utils/auth";

export const LogoutButton = () => {
  const isMobile = useIsMobile();
  const { setKey } = useEncryption();

  return (
    <Button
      onClick={() => {
        logout();
        setKey("");
      }}
      intent={Intent.DANGER}
      rightIcon="power"
      large
    >
      {!isMobile && "Logout"}
    </Button>
  );
};
