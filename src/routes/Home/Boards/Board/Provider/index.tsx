import { firestoreConverter } from "configs/firebase";
import { collection } from "firebase/firestore";
import { createContext, FC, ReactNode, useContext, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Navigate } from "react-router-dom";
import { useBoards } from "routes/Home/Boards/Provider";
import {
  BoardDocument,
  Collection,
  CredentialDocument,
  DocumentDocument,
} from "types/firebase/collections";

interface IBoardContext {
  board?: BoardDocument;
  credentials?: CredentialDocument[];
  documents?: DocumentDocument[];
  loading: boolean;
}

const BoardContext = createContext<IBoardContext>({
  board: undefined,
  credentials: undefined,
  documents: undefined,
  loading: false,
});

BoardContext.displayName = "Board";

export const useBoard = () => useContext(BoardContext);

interface BoardProviderProps {
  boardId: string;
  children: ReactNode;
}

const BoardProvider: FC<BoardProviderProps> = ({ children, boardId }) => {
  const { boards } = useBoards();

  const board = useMemo(() => {
    return boards?.find((board) => board.id === boardId);
  }, [boards, boardId]);

  const [credentials, loadingCredentials] =
    useCollectionData<CredentialDocument>(
      board?.ref
        ? collection(board.ref, Collection.credentials).withConverter(
            firestoreConverter
          )
        : undefined
    );

  const [documents, loadingDocuments] = useCollectionData<DocumentDocument>(
    board?.ref
      ? collection(board.ref, Collection.documents).withConverter(
          firestoreConverter
        )
      : undefined
  );

  const loading = useMemo(() => {
    return loadingCredentials || loadingDocuments;
  }, [loadingCredentials, loadingDocuments]);

  const context = useMemo(() => {
    return { board, credentials, documents, loading };
  }, [board, credentials, documents, loading]);

  if (!board) {
    return <Navigate to="/" />;
  }

  return (
    <BoardContext.Provider value={context}>{children}</BoardContext.Provider>
  );
};

export default BoardProvider;
