import { useLocalStorage } from "@mantine/hooks";
import dayjs from "dayjs";
import { IdTokenResult } from "firebase/auth";
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "utils/firebase";

export interface ISecureLoginContext {
  isSecure: boolean;
}

const SecureLoginContext = createContext<ISecureLoginContext>({
  isSecure: false,
});

SecureLoginContext.displayName = "SecureLogin";

export const useSecureLogin = () => useContext(SecureLoginContext);

interface SecureLoginProviderProps {
  children: ReactNode;
}

const getDefaultSignOutTimestamp = () => +dayjs().add(6, "hours");

const SecureLoginProvider: FC<SecureLoginProviderProps> = ({ children }) => {
  const [user] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const [idTokenResult, setIdTokenResult] = useState<IdTokenResult>();
  const [, setSignOutTimestamp] = useLocalStorage({
    key: "automatic-sign-out-timestamp",
    defaultValue: getDefaultSignOutTimestamp(),
    getInitialValueInEffect: true,
  });
  const isSecure = useMemo(() => {
    return idTokenResult?.signInProvider === "password";
  }, [idTokenResult?.signInProvider]);

  const handleEvent = useCallback(() => {
    setSignOutTimestamp((signOutTimestamp) => {
      if (!idTokenResult) {
        return signOutTimestamp;
      }

      if (isSecure && +dayjs() >= signOutTimestamp) {
        signOut();

        return 1;
      }

      return getDefaultSignOutTimestamp();
    });
  }, [isSecure, setSignOutTimestamp, signOut, idTokenResult]);

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged((user) => {
      if (user) {
        user
          .getIdTokenResult()
          .then(setIdTokenResult)
          .catch(() => {
            setIdTokenResult(undefined);
          });
      } else {
        setIdTokenResult(undefined);
      }
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    handleEvent();

    window.addEventListener("click", handleEvent);
    window.addEventListener("keydown", handleEvent);

    return () => {
      window.removeEventListener("keydown", handleEvent);
      window.removeEventListener("click", handleEvent);
    };
  }, [handleEvent]);

  const context = useMemo(() => {
    return {
      isSecure,
    };
  }, [isSecure]);

  return (
    <SecureLoginContext.Provider value={context}>
      {children}
    </SecureLoginContext.Provider>
  );
};

export default SecureLoginProvider;
