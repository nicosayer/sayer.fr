import React, { useContext, useEffect, useState } from "react";

import { auth } from "config/firebase";

const CurrentUserContext = React.createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);

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
