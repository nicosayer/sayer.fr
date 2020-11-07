import { Button, Intent } from "@blueprintjs/core";
import { Tooltip } from "components/Tooltip";
import { useWindowSize } from "hooks/useWindowSize";
import { useUser } from "providers/UserProvider";
import React from "react";

export const LogoutButton = () => {
  const { isOnComputer } = useWindowSize();
  const { user, logout } = useUser();

  return (
    <Tooltip content={user.email}>
      <Button onClick={logout} intent={Intent.DANGER} rightIcon="power" large>
        {isOnComputer && "Logout"}
      </Button>
    </Tooltip>
  );
};
