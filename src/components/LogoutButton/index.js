import { Button, Intent } from "@blueprintjs/core";
import { useIsMobile } from "hooks/useIsMobile";
import { useUser } from "providers/UserProvider";
import React from "react";

export const LogoutButton = () => {
  const isMobile = useIsMobile();
  const { logout } = useUser();

  return (
    <Button onClick={logout} intent={Intent.DANGER} rightIcon="power" large>
      {!isMobile && "Logout"}
    </Button>
  );
};
