import { useUser } from "providers/UserProvider";
import { useCallback } from "react";

export const useRoles = () => {
  const { user } = useUser();

  const isEditorOf = useCallback(
    (board) => {
      return board.editors.includes(user.email);
    },
    [user.email]
  );

  const isViewerOf = useCallback(
    (board) => {
      return board.viewers.includes(user.email);
    },
    [user.email]
  );

  return { isViewerOf, isEditorOf };
};
