import { CurrentUserContext } from "providers/CurrentUserProvider";
import { useContext } from "react";

export const useCurrentUser = () => useContext(CurrentUserContext);
