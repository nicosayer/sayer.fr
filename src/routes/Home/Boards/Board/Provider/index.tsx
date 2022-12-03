import { SpotlightProvider } from "@mantine/spotlight";
import { firestoreConverter } from "configs/firebase";
import { collection } from "firebase/firestore";
import { createContext, FC, ReactNode, useContext, useMemo } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Navigate, useNavigate } from "react-router-dom";
import { useBoards } from "routes/Home/Boards/Provider";
import {
  BoardDocument,
  Collection,
  CredentialDocument,
  DocumentDocument,
} from "types/firebase/collections";
import { sanitize } from "utils/string";

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
  const navigate = useNavigate();

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
    <BoardContext.Provider value={context}>
      <SpotlightProvider
        shortcut="mod + K"
        actions={[
          ...(credentials ?? []).map((credential) => {
            return {
              title: credential.name ?? "",
              group: "Mot de passe",
              onTrigger: () => {
                navigate(`/boards/${boardId}/credentials/${credential.id}`);
              },
            };
          }),
          ...(documents ?? []).map((document) => {
            return {
              title: `${document.type} - ${document.owner}`,
              group: "Document",
              onTrigger: () => {
                navigate(`/boards/${boardId}/documents/${document.id}`);
              },
            };
          }),
        ]}
        filter={(query, actions) =>
          actions.filter(
            (action) => sanitize(action.title).indexOf(sanitize(query)) > -1
          )
        }
      >
        {children}
      </SpotlightProvider>
    </BoardContext.Provider>
  );
};

export default BoardProvider;
