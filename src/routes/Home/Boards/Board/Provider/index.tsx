import { useDidUpdate, useLocalStorage } from "@mantine/hooks";
import dayjs from "dayjs";
import { deleteDoc } from "firebase/firestore";
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
  TagDocument,
  TaskDocument,
} from "types/firebase/collections";

export interface IBoardContext {
  board?: BoardDocument;
  boards?: BoardDocument[];
  tags: TagDocument[];
  setExtraBoardIds: (
    val: string[] | ((prevState: string[]) => string[])
  ) => void;
  credentials?: CredentialDocument[];
  creditCards?: CreditCardDocument[];
  documents?: DocumentDocument[];
  groceries?: GroceryDocument[];
  notes?: NoteDocument[];
  tasks?: TaskDocument[];
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
  tags: [],
  setExtraBoardIds: () => {},
  credentials: undefined,
  creditCards: undefined,
  documents: undefined,
  groceries: undefined,
  notes: undefined,
  tasks: undefined,
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
  const { boards, tags: boardsTags } = useBoards();

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

  useDidUpdate(() => {
    groceries.forEach((grocery) => {
      if (
        grocery.closedAt &&
        dayjs(grocery.closedAt.toDate()).isBefore(
          dayjs().subtract(7, "days")
        ) &&
        grocery.ref
      ) {
        deleteDoc(grocery.ref);
      }
    });
  }, [groceries]);

  useDidUpdate(() => {
    tasks.forEach((task) => {
      if (
        task.closedAt &&
        dayjs(task.closedAt.toDate()).isBefore(dayjs().subtract(7, "days")) &&
        task.ref
      ) {
        deleteDoc(task.ref);
      }
    });
  }, [tasks]);

  const context = useMemo(() => {
    return {
      board,
      boards: currentBoards,
      tags: boardsTags?.[boardId] ?? [],
      setExtraBoardIds,
      credentials,
      creditCards,
      documents,
      groceries,
      notes,
      tasks,
      loadingCredentials,
      loadingCreditCards,
      loadingDocuments,
      loadingGroceries,
      loadingNotes,
      loadingTasks,
    };
  }, [
    board,
    boardId,
    boardsTags,
    credentials,
    creditCards,
    currentBoards,
    documents,
    groceries,
    loadingCredentials,
    loadingCreditCards,
    loadingDocuments,
    loadingGroceries,
    loadingNotes,
    loadingTasks,
    notes,
    setExtraBoardIds,
    tasks,
  ]);

  if (!currentBoards?.length) {
    return <Navigate to="/" />;
  }

  return (
    <BoardContext.Provider value={context}>{children}</BoardContext.Provider>
  );
};

export default BoardProvider;
