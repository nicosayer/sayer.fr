import { useLocalStorage } from "@mantine/hooks";
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
  GroceryDocument,
  NoteDocument,
  TaskDocument,
} from "types/firebase/collections";

export interface IBoardContext {
  board?: BoardDocument;
  boards?: BoardDocument[];
  setExtraBoardIds: (
    val: string[] | ((prevState: string[]) => string[])
  ) => void;
  credentials?: CredentialDocument[];
  notes?: NoteDocument[];
  tasks?: TaskDocument[];
  groceries?: GroceryDocument[];
  creditCards?: CreditCardDocument[];
  documents?: DocumentDocument[];
  loadingCredentials: boolean;
  loadingCreditCards: boolean;
  loadingDocuments: boolean;
  loadingGroceries: boolean;
  loadingNotes: boolean;
  loadingTasks: boolean;
}

const BoardContext = createContext<IBoardContext>({
  board: undefined,
  boards: undefined,
  setExtraBoardIds: () => {},
  credentials: undefined,
  notes: undefined,
  tasks: undefined,
  groceries: undefined,
  creditCards: undefined,
  documents: undefined,
  loadingCredentials: false,
  loadingCreditCards: false,
  loadingDocuments: false,
  loadingGroceries: false,
  loadingNotes: false,
  loadingTasks: false,
});

BoardContext.displayName = "Board";

export const useBoard = () => useContext(BoardContext);

interface BoardProviderProps {
  boardId: string;
  children: ReactNode;
}

const BoardProvider: FC<BoardProviderProps> = ({ children, boardId }) => {
  const { boards } = useBoards();

  const [extraBoardIds, setExtraBoardIds] = useLocalStorage<string[]>({
    key: "extra-board-ids",
    defaultValue: [],
    getInitialValueInEffect: false,
  });

  const board = useMemo(() => {
    return boards?.find((board) => board.id === boardId);
  }, [boards, boardId]);

  const currentBoards = useMemo(() => {
    return boards?.filter(
      (board) =>
        board.id === boardId || (board?.id && extraBoardIds.includes(board?.id))
    );
  }, [boardId, boards, extraBoardIds]);

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

  const [groceries, loadingGroceries] =
    useBoardsCollectionsData<GroceryDocument>(
      currentBoards ?? [],
      Collection.groceries
    );

  const [notes, loadingNotes] = useBoardsCollectionsData<NoteDocument>(
    currentBoards ?? [],
    Collection.notes
  );

  const [tasks, loadingTasks] = useBoardsCollectionsData<TaskDocument>(
    currentBoards ?? [],
    Collection.tasks
  );

  const context = useMemo(() => {
    return {
      board,
      boards: currentBoards,
      setExtraBoardIds,
      credentials,
      creditCards,
      documents,
      notes,
      tasks,
      groceries,
      loadingCredentials,
      loadingCreditCards,
      loadingDocuments,
      loadingGroceries,
      loadingNotes,
      loadingTasks,
    };
  }, [
    board,
    setExtraBoardIds,
    currentBoards,
    notes,
    tasks,
    groceries,
    credentials,
    creditCards,
    documents,
    loadingCredentials,
    loadingCreditCards,
    loadingDocuments,
    loadingGroceries,
    loadingNotes,
    loadingTasks,
  ]);

  if (!currentBoards?.length) {
    return <Navigate to="/" />;
  }

  return (
    <BoardContext.Provider value={context}>{children}</BoardContext.Provider>
  );
};

export default BoardProvider;
