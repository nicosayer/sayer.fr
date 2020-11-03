import { Button, Intent } from "@blueprintjs/core";
import React from "react";
import { logout } from "utils/auth";

export const LogoutButton = () => {
  return (
    <Button onClick={logout} intent={Intent.DANGER} rightIcon="power" large>
      Logout
    </Button>
  );
};
