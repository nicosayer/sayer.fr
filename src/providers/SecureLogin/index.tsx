import { IdTokenResult } from "firebase/auth";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "utils/firebase";

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

const SecureLoginProvider: FC<SecureLoginProviderProps> = ({ children }) => {
  const [user] = useAuthState(auth);
  const [idTokenResult, setIdTokenResult] = useState<IdTokenResult>();

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

  const context = useMemo(() => {
    return {
      isSecure: idTokenResult?.signInProvider === "password",
      cannotBeSecure: !user?.providerData.find(
        (provider) => provider.providerId === "password"
      ),
    };
  }, [idTokenResult?.signInProvider, user?.providerData]);

  return (
    <SecureLoginContext.Provider value={context}>
      {children}
    </SecureLoginContext.Provider>
  );
};

export default SecureLoginProvider;
