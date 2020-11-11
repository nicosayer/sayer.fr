import React, { useContext, useEffect, useState } from "react";

import { auth } from "config/firebase";
import { logError } from "utils";
import { logout } from "utils/auth";

const UserContext = React.createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        setUser();
        setLoading(false);
        logError(error, { type: "UserProvider" });
      }
    );

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isAuth: Boolean(user),
        logout: () => {
          logout();
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
