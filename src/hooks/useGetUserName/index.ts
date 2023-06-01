import { useCallback } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { getEmailLocale } from "utils/string";

const useGetUserName = () => {
  const { users } = useBoard();

  return useCallback(
    (email: string) => {
      return users?.[email].name ?? getEmailLocale(email);
    },
    [users]
  );
};

export default useGetUserName;
