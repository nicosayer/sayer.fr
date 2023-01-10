import { IdTokenResult } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "utils/firebase";

const useIsSecure = () => {
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

  return useMemo(() => {
    return {
      isSecure: idTokenResult?.signInProvider === "password",
      cannotBeSecure: !user?.providerData.find(
        (provider) => provider.providerId === "password"
      ),
    };
  }, [idTokenResult?.signInProvider, user]);
};

export default useIsSecure;
