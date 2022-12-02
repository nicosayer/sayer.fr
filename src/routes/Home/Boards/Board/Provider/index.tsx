import { useDebouncedValue } from "@mantine/hooks";
import { db, firestoreConverter } from "configs/firebase";
import { doc } from "firebase/firestore";
import FullPageLoading from "providers/FullPageLoading/FullPage";
import { createContext, FC, ReactNode, useContext, useMemo } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Navigate } from "react-router-dom";
import { BoardDocument, Collection } from "types/firebase/collections";
import { useBoards } from "../../Provider";

interface IBoardContext {
  board?: BoardDocument;
  loading: boolean;
}

const BoardContext = createContext<IBoardContext>({
  board: undefined,
  loading: false,
});

BoardContext.displayName = "Board";

export const useBoard = () => useContext(BoardContext);

interface BoardProviderProps {
  boardId: string;
  children: ReactNode;
}

const BoardProvider: FC<BoardProviderProps> = ({ children, boardId }) => {
  const { boards } = useBoards()

  const board = useMemo(() => {
    return boards?.find(board => board.id === boardId)
  }, [boards, boardId])


  const context = useMemo(() => {
    return { board, loading: false };
  }, [board]);

  if (!board) {
    return <Navigate to='/' />
  }

  return (
    <BoardContext.Provider value={context}>{children}</BoardContext.Provider>
  );
};

export default BoardProvider;
