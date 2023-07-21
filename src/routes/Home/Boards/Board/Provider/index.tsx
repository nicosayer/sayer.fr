import { useDidUpdate, useLocalStorage } from "@mantine/hooks";
import dayjs from "dayjs";
import { deleteDoc, doc } from "firebase/firestore";
import useDocumentsCollectionsData from "hooks/useDocumentsCollectionsData";
import useDocumentsData from "hooks/useDocumentsData";
import { flatMap, uniq } from "lodash";
import { createContext, FC, ReactNode, useContext, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useBoards } from "routes/Home/Boards/Provider";
import {
  BoardDocument,
  Collection,
  CredentialDocument,
  DocumentDocument,
  GroceryDocument,
  ListDocument,
  ListItemDocument,
  NoteDocument,
  TodoDocument,
  UserDocument,
} from "types/firebase/collections";
import { db } from "utils/firebase";

export interface IBoardContext {
  board?: BoardDocument;
  boards?: BoardDocument[];
  setExtraBoardIds: (
    val: string[] | ((prevState: string[]) => string[])
  ) => void;
  credentials?: CredentialDocument[];
  documents?: DocumentDocument[];
  groceries?: GroceryDocument[];
  lists?: ListDocument[];
  listItems?: ListItemDocument[];
  notes?: NoteDocument[];
  todos?: TodoDocument[];
  users?: Record<string, UserDocument>;
  loadingCredentials: boolean;
  loadingDocuments: boolean;
  loadingGroceries: boolean;
  loadingLists: boolean;
  loadingListItems: boolean;
  loadingNotes: boolean;
  loadingTodos: boolean;
  loadingUsers: boolean;
}

const BoardContext = createContext<IBoardContext>({
  board: undefined,
  boards: undefined,
  setExtraBoardIds: () => {},
  credentials: undefined,
  documents: undefined,
  groceries: undefined,
  lists: undefined,
  listItems: undefined,
  notes: undefined,
  todos: undefined,
  users: undefined,
  loadingCredentials: false,
  loadingDocuments: false,
  loadingGroceries: false,
  loadingLists: false,
  loadingListItems: false,
  loadingNotes: false,
  loadingTodos: false,
  loadingUsers: false,
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

  const [todos, loadingTodos] = useDocumentsCollectionsData<TodoDocument>(
    currentBoards ?? [],
    Collection.todos
  );

  const userReferences = useMemo(() => {
    return uniq(flatMap(currentBoards, (board) => board.users)).map((email) =>
      doc(db, Collection.users, String(email))
    );
  }, [currentBoards]);

  const [users, loadingUsers] = useDocumentsData<UserDocument>(userReferences);

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
    notes.forEach((note) => {
      if (
        !note.text?.trim() &&
        note.updatedAt &&
        dayjs(note.updatedAt.toDate()).isBefore(dayjs().subtract(7, "days")) &&
        note.ref
      ) {
        deleteDoc(note.ref);
      }
    });
  }, [notes]);

  useDidUpdate(() => {
    todos.forEach((todo) => {
      if (
        todo.closedAt &&
        dayjs(todo.closedAt.toDate()).isBefore(dayjs().subtract(7, "days")) &&
        todo.ref
      ) {
        deleteDoc(todo.ref);
      }
    });
  }, [todos]);

  const context = useMemo(() => {
    return {
      board,
      boards: currentBoards,
      setExtraBoardIds,
      credentials,
      documents,
      groceries,
      lists,
      listItems,
      notes,
      todos,
      users,
      loadingCredentials,
      loadingDocuments,
      loadingGroceries,
      loadingLists,
      loadingListItems,
      loadingNotes,
      loadingTodos,
      loadingUsers,
    };
  }, [
    board,
    setExtraBoardIds,
    credentials,
    currentBoards,
    documents,
    groceries,
    lists,
    listItems,
    notes,
    todos,
    users,
    loadingCredentials,
    loadingDocuments,
    loadingGroceries,
    loadingLists,
    loadingListItems,
    loadingNotes,
    loadingTodos,
    loadingUsers,
  ]);

  if (!currentBoards?.length) {
    return <Navigate to="/" />;
  }

  return (
    <BoardContext.Provider value={context}>{children}</BoardContext.Provider>
  );
};

export default BoardProvider;
