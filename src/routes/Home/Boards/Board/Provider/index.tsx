import useBoardsCollectionsData from "hooks/useBoardsCollectionsData";
import { createContext, FC, ReactNode, useContext, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useBoards } from "routes/Home/Boards/Provider";
import {
  BoardDocument,
  Collection,
  CredentialDocument,
  CreditCardDocument,
  DocumentDocument,
  NoteDocument,
  TaskDocument,
} from "types/firebase/collections";
import { ALL_BOARDS_SLUG } from "utils/boards";

interface IBoardContext {
  board?: BoardDocument;
  boards?: BoardDocument[];
  credentials?: CredentialDocument[];
  notes?: NoteDocument[];
  tasks?: TaskDocument[];
  creditCards?: CreditCardDocument[];
  documents?: DocumentDocument[];
  loading: boolean;
}

const BoardContext = createContext<IBoardContext>({
  board: undefined,
  boards: undefined,
  credentials: undefined,
  notes: undefined,
  tasks: undefined,
  creditCards: undefined,
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

  const currentBoards = useMemo(() => {
    return boards?.filter(
      (board) => board.id === boardId || boardId === ALL_BOARDS_SLUG
    );
  }, [boards, boardId]);

  const board = useMemo(() => {
    return currentBoards?.length === 1 ? currentBoards[0] : undefined;
  }, [currentBoards]);

  const [credentials, loadingCredentials] =
    useBoardsCollectionsData<CredentialDocument>(
      currentBoards ?? [],
      Collection.credentials
    );

  const [documents, loadingDocuments] =
    useBoardsCollectionsData<DocumentDocument>(
      currentBoards ?? [],
      Collection.documents
    );

  const [creditCards, loadingCreditCards] =
    useBoardsCollectionsData<CreditCardDocument>(
      currentBoards ?? [],
      Collection.creditCards
    );

  const [notes, loadingNotes] = useBoardsCollectionsData<NoteDocument>(
    currentBoards ?? [],
    Collection.notes
  );

  const [tasks, loadingTasks] = useBoardsCollectionsData<TaskDocument>(
    currentBoards ?? [],
    Collection.tasks
  );

  const loading = useMemo(() => {
    return (
      loadingCredentials ||
      loadingCreditCards ||
      loadingDocuments ||
      loadingNotes ||
      loadingTasks
    );
  }, [
    loadingCredentials,
    loadingCreditCards,
    loadingDocuments,
    loadingNotes,
    loadingTasks,
  ]);

  const context = useMemo(() => {
    return {
      board,
      boards: currentBoards,
      credentials,
      creditCards,
      documents,
      notes,
      tasks,
      loading,
    };
  }, [
    board,
    currentBoards,
    notes,
    tasks,
    credentials,
    creditCards,
    documents,
    loading,
  ]);

  if (!currentBoards?.length) {
    return <Navigate to="/" />;
  }

  return (
    <BoardContext.Provider value={context}>{children}</BoardContext.Provider>
  );
};

export default BoardProvider;
