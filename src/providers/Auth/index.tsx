import { toaster } from "evergreen-ui";
import React, { ReactNode, useContext, useEffect, useState } from "react";

import { ADMIN_EMAILS } from "config/admin";
import { auth } from "config/firebase";
import { logout } from "utils/auth";

export interface IAuthContext {
  isAuth: boolean;
}

const AuthContext = React.createContext<IAuthContext>({
  isAuth: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (ADMIN_EMAILS.includes(user?.email ?? "")) {
        setIsAuth(true);
      } else {
        if (user) {
          toaster.notify("Only administrator are alowed to edit the tree.");
        }
        setIsAuth(false);
        logout();
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
