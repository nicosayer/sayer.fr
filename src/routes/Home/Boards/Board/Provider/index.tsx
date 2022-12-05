import {
  Badge,
  Group,
  Text,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import { SpotlightActionProps, SpotlightProvider } from "@mantine/spotlight";
import classNames from "classnames";
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
  CreditCardDocument,
  DocumentDocument,
} from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import { sanitize } from "utils/string";

interface IBoardContext {
  board?: BoardDocument;
  credentials?: CredentialDocument[];
  creditCards?: CreditCardDocument[];
  documents?: DocumentDocument[];
  loading: boolean;
}

const BoardContext = createContext<IBoardContext>({
  board: undefined,
  credentials: undefined,
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

function CustomAction({
  action,
  styles,
  hovered,
  onTrigger,
  ...others
}: SpotlightActionProps) {
  const theme = useMantineColorScheme();

  return (
    <UnstyledButton
      className={classNames(
        "relative block w-full py-[10px] px-[12px] rounded",
        {
          "bg-dark-400": hovered && theme.colorScheme === "dark",
          "bg-gray-100": hovered && theme.colorScheme !== "dark",
        }
      )}
      onClick={onTrigger}
      {...others}
    >
      <Group noWrap>
        <div className="flex-1">
          <Text>{action.title}</Text>
          {action.description && (
            <Text color="dimmed" size="xs">
              {action.description}
            </Text>
          )}
        </div>
        {action.tag && (
          <Badge color={getColorFromString(action.tag)} variant="dot">
            {action.tag}
          </Badge>
        )}
      </Group>
    </UnstyledButton>
  );
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

  const [creditCards, loadingCreditCards] =
    useCollectionData<CreditCardDocument>(
      board?.ref
        ? collection(board.ref, Collection.creditCards).withConverter(
          firestoreConverter
        )
        : undefined
    );

  const loading = useMemo(() => {
    return loadingCredentials || loadingCreditCards || loadingDocuments;
  }, [loadingCredentials, loadingCreditCards, loadingDocuments]);

  const context = useMemo(() => {
    return { board, credentials, creditCards, documents, loading };
  }, [board, credentials, creditCards, documents, loading]);

  if (!board) {
    return <Navigate to="/" />;
  }

  return (
    <BoardContext.Provider value={context}>
      <SpotlightProvider
        shortcut="mod + K"
        nothingFoundMessage="Aucun résultat..."
        actions={(query) => query ? [
          ...(credentials ?? []).map((credential) => {
            return {
              title: credential.name ?? "",
              description: credential.username,
              tag: credential.tag,
              group: "Mot de passe",
              onTrigger: () => {
                navigate(`/boards/${boardId}/credentials/${credential.id}`);
              },
            };
          }),
          ...(documents ?? []).map((document) => {
            return {
              title: document.name ?? "",
              tag: document.tag,
              group: "Document",
              onTrigger: () => {
                navigate(`/boards/${boardId}/documents/${document.id}`);
              },
            };
          }),
          ...(creditCards ?? []).map((creditCard) => {
            return {
              title: creditCard.name ?? "",
              description: creditCard.cardholder,
              tag: creditCard.tag,
              group: "Carte de crédit",
              onTrigger: () => {
                navigate(`/boards/${boardId}/credit-cards/${creditCard.id}`);
              },
            };
          }),
        ] : []}
        filter={(query, actions) =>
          actions.filter(
            (action) =>
              sanitize(
                `${action.title}${action.description}${action.tag}`
              ).indexOf(sanitize(query)) > -1
          )
        }
        actionComponent={CustomAction}
      >
        {children}
      </SpotlightProvider>
    </BoardContext.Provider>
  );
};

export default BoardProvider;
