import { Button } from "components/Button";
import { useUser } from "providers/UserProvider";
import React from "react";

export const LogoutButton = (props) => {
  const { logout } = useUser();

  return <Button onClick={logout} {...props} />;
};
