import { useLocalStorage } from "@mantine/hooks";
import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "utils/firebase";
import { ONE_SECOND } from "utils/time";

const useAutomaticSigOut = () => {
  const [signOut] = useSignOut(auth);

  const [signOutTimestamp, setSignOutTimestamp] = useLocalStorage({
    key: "automatic-sign-out-timestamp",
    defaultValue: +dayjs().add(5, "minutes"),
  });

  const handleEvent = useCallback(() => {
    setSignOutTimestamp(+dayjs().add(5, "minutes"));
  }, [setSignOutTimestamp]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (+dayjs() >= signOutTimestamp) {
        signOut();
      }
    }, ONE_SECOND);

    return () => {
      clearInterval(interval);
    };
  }, [signOut, signOutTimestamp]);

  useEffect(() => {
    handleEvent();

    window.addEventListener("click", handleEvent);
    window.addEventListener("keydown", handleEvent);

    return () => {
      window.removeEventListener("keydown", handleEvent);
      window.removeEventListener("click", handleEvent);
    };
  }, [handleEvent]);
};

export default useAutomaticSigOut;
