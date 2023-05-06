import { useDebouncedValue } from "@mantine/hooks";
import { collection, orderBy, query, where } from "firebase/firestore";
import { sortBy } from "lodash";
import FullPageLoading from "providers/FullPageLoading/FullPage";
import { createContext, FC, ReactNode, useContext, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { BoardDocument, Collection } from "types/firebase/collections";
import { auth, db, firestoreConverter } from "utils/firebase";
import { sanitize } from "utils/string";

interface IBoardsContext {
  boards?: BoardDocument[];
  loading: boolean;
}

const BoardsContext = createContext<IBoardsContext>({
  boards: undefined,
  loading: false,
});

BoardsContext.displayName = "Boards";

export const useBoards = () => useContext(BoardsContext);

interface BoardsProviderProps {
  children: ReactNode;
}

const BoardsProvider: FC<BoardsProviderProps> = ({ children }) => {
  const [user] = useAuthState(auth);

  const [boards, loadingBoards] = useCollectionData<BoardDocument>(
    query(
      collection(db, Collection.boards),
      where("users", "array-contains", user?.email),
      orderBy("name")
    ).withConverter(firestoreConverter)
  );

  const [loading] = useDebouncedValue(loadingBoards, 200);

  const context = useMemo(() => {
    const orderedBoards = sortBy(boards, (board) =>
      sanitize(String(board.name))
    );

    return {
      boards: orderedBoards,
      loading,
    };
  }, [boards, loading]);

  if (loading) {
    return <FullPageLoading />;
  }

  return (
    <BoardsContext.Provider value={context}>{children}</BoardsContext.Provider>
  );
};

export default BoardsProvider;
