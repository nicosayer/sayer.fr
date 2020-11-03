import { CurrentUserContext } from "providers/CurrentUserProvider";
import { useContext } from "react";

export const useGetCurrentUser = () => useContext(CurrentUserContext);
