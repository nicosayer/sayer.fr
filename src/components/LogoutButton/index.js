import { Button, Intent } from "@blueprintjs/core";
import { useIsMobile } from "hooks/useIsMobile";
import React from "react";
import { logout } from "utils/auth";

export const LogoutButton = () => {
  const isMobile = useIsMobile();

  return (
    <Button onClick={logout} intent={Intent.DANGER} rightIcon="power" large>
      {!isMobile && "Logout"}
    </Button>
  );
};
