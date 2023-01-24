import { useIdle, useLocalStorage } from "@mantine/hooks";
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
import { ONE_MINUTE, ONE_SECOND } from "utils/time";

interface ISecureLoginContext {
  isSecure: boolean;
  cannotBeSecure?: boolean;
}

const SecureLoginContext = createContext<ISecureLoginContext>({
  isSecure: false,
  cannotBeSecure: undefined,
});

SecureLoginContext.displayName = "SecureLogin";

export const useSecureLogin = () => useContext(SecureLoginContext);

interface SecureLoginProviderProps {
  children: ReactNode;
}

const getDefaultSignOutTimestamp = () => +dayjs().add(5, "minutes");

const SecureLoginProvider: FC<SecureLoginProviderProps> = ({ children }) => {
  const [user] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const [idTokenResult, setIdTokenResult] = useState<IdTokenResult>();
  const isSecure = useMemo(() => {
    return idTokenResult?.signInProvider === "password";
  }, [idTokenResult?.signInProvider]);
  const [signOutTimestamp, setSignOutTimestamp] = useLocalStorage({
    key: "automatic-sign-out-timestamp",
    defaultValue: getDefaultSignOutTimestamp(),
    getInitialValueInEffect: false,
  });

  const handleEvent = useCallback(() => {
    setSignOutTimestamp(getDefaultSignOutTimestamp());
  }, [setSignOutTimestamp]);

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
    const interval = setInterval(() => {
      if (isSecure && +dayjs() >= signOutTimestamp) {
        signOut();
      }
    }, ONE_SECOND);

    return () => {
      clearInterval(interval);
    };
  }, [isSecure, signOut, signOutTimestamp]);

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
      cannotBeSecure: !user?.providerData.find(
        (provider) => provider.providerId === "password"
      ),
    };
  }, [isSecure, user?.providerData]);

  return (
    <SecureLoginContext.Provider value={context}>
      {children}
    </SecureLoginContext.Provider>
  );
};

export default SecureLoginProvider;
