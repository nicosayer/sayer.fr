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

interface ISecureLoginContext {
  isSecure: boolean;
  canBeSecure: boolean;
}

const SecureLoginContext = createContext<ISecureLoginContext>({
  isSecure: false,
  canBeSecure: false,
});

SecureLoginContext.displayName = "SecureLogin";

export const useSecureLogin = () => useContext(SecureLoginContext);

interface SecureLoginProviderProps {
  children: ReactNode;
}

const getDefaultSignOutTimestamp = () => +dayjs().add(2, "hours");

const SecureLoginProvider: FC<SecureLoginProviderProps> = ({ children }) => {
  const [user] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const [idTokenResult, setIdTokenResult] = useState<IdTokenResult>();
  const [, setSignOutTimestamp] = useLocalStorage({
    key: "automatic-sign-out-timestamp",
    defaultValue: getDefaultSignOutTimestamp(),
    getInitialValueInEffect: false,
  });
  const isSecure = useMemo(() => {
    return idTokenResult?.signInProvider === "password";
  }, [idTokenResult?.signInProvider]);

  const handleEvent = useCallback(() => {
    setSignOutTimestamp((signOutTimestamp) => {
      if (isSecure && +dayjs() >= signOutTimestamp) {
        signOut();
      }

      return getDefaultSignOutTimestamp();
    });
  }, [isSecure, setSignOutTimestamp, signOut]);

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
      canBeSecure:
        user?.providerData.some(
          (provider) => provider.providerId === "password"
        ) ?? false,
    };
  }, [isSecure, user?.providerData]);

  return (
    <SecureLoginContext.Provider value={context}>
      {children}
    </SecureLoginContext.Provider>
  );
};

export default SecureLoginProvider;
