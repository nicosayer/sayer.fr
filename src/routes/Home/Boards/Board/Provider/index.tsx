import { useDidUpdate, useLocalStorage } from "@mantine/hooks";
import dayjs from "dayjs";
import { deleteDoc } from "firebase/firestore";
import useDocumentsCollectionsData from "hooks/useDocumentsCollectionsData";
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
  ListDocument,
  ListItemDocument,
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
  creditCards?: CreditCardDocument[];
  documents?: DocumentDocument[];
  groceries?: GroceryDocument[];
  lists?: ListDocument[];
  listItems?: ListItemDocument[];
  notes?: NoteDocument[];
  tasks?: TaskDocument[];
  loadingCredentials: boolean;
  loadingCreditCards: boolean;
  loadingDocuments: boolean;
  loadingGroceries: boolean;
  loadingLists: boolean;
  loadingListItems: boolean;
  loadingNotes: boolean;
  loadingTasks: boolean;
}

const BoardContext = createContext<IBoardContext>({
  board: undefined,
  boards: undefined,
  setExtraBoardIds: () => {},
  credentials: undefined,
  creditCards: undefined,
  documents: undefined,
  groceries: undefined,
  lists: undefined,
  listItems: undefined,
  notes: undefined,
  tasks: undefined,
  loadingCredentials: false,
  loadingCreditCards: false,
  loadingDocuments: false,
  loadingGroceries: false,
  loadingLists: false,
  loadingListItems: false,
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
    useDocumentsCollectionsData<CredentialDocument>(
      currentBoards ?? [],
      Collection.credentials
    );

  const [documents, loadingDocuments] =
    useDocumentsCollectionsData<DocumentDocument>(
      currentBoards ?? [],
      Collection.documents
    );

  const [creditCards, loadingCreditCards] =
    useDocumentsCollectionsData<CreditCardDocument>(
      currentBoards ?? [],
      Collection.creditCards
    );

  const [groceries, loadingGroceries] =
    useDocumentsCollectionsData<GroceryDocument>(
      currentBoards ?? [],
      Collection.groceries
    );

  const [lists, loadingLists] = useDocumentsCollectionsData<ListDocument>(
    currentBoards ?? [],
    Collection.lists
  );

  const [listItems, loadingListItems] =
    useDocumentsCollectionsData<ListItemDocument>(lists, Collection.listItems);

  const [notes, loadingNotes] = useDocumentsCollectionsData<NoteDocument>(
    currentBoards ?? [],
    Collection.notes
  );

  const [tasks, loadingTasks] = useDocumentsCollectionsData<TaskDocument>(
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
      setExtraBoardIds,
      credentials,
      creditCards,
      documents,
      groceries,
      lists,
      listItems,
      notes,
      tasks,
      loadingCredentials,
      loadingCreditCards,
      loadingDocuments,
      loadingGroceries,
      loadingLists,
      loadingListItems,
      loadingNotes,
      loadingTasks,
    };
  }, [
    board,
    credentials,
    creditCards,
    currentBoards,
    documents,
    groceries,
    lists,
    listItems,
    loadingCredentials,
    loadingCreditCards,
    loadingDocuments,
    loadingGroceries,
    loadingLists,
    loadingListItems,
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
