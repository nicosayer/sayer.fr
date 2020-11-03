import React, { useEffect, useState } from "react";

import { auth } from "config/firebase";

export const CurrentUserContext = React.createContext();

export const CurrentUserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(
      (user) => {
        setAuthUser(user);
        setLoading(false);
        setError();
      },
      (error) => {
        setAuthUser();
        setLoading(false);
        setError(error);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{
        authUser,
        loading,
        error,
        isAuth: Boolean(authUser),
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};
