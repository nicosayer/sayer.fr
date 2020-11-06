import { Button, Intent } from "@blueprintjs/core";
import { Tooltip } from "components/Tooltip";
import { useIsMobile } from "hooks/useIsMobile";
import { useUser } from "providers/UserProvider";
import React from "react";

export const LogoutButton = () => {
  const isMobile = useIsMobile();
  const { user, logout } = useUser();

  return (
    <Tooltip content={user.email}>
      <Button onClick={logout} intent={Intent.DANGER} rightIcon="power" large>
        {!isMobile && "Logout"}
      </Button>
    </Tooltip>
  );
};
