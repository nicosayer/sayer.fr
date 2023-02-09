import { useDebouncedValue } from "@mantine/hooks";
import {
  collection,
  DocumentReference,
  query,
  where,
} from "firebase/firestore";
import useBoardsCollectionsData from "hooks/useBoardsCollectionsData";
import { Dictionary, groupBy, orderBy } from "lodash";
import FullPageLoading from "providers/FullPageLoading/FullPage";
import { createContext, FC, ReactNode, useContext, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  BoardDocument,
  Collection,
  TagDocument,
} from "types/firebase/collections";
import { auth, db, firestoreConverter } from "utils/firebase";
import { sanitize } from "utils/string";

interface IBoardsContext {
  boards?: BoardDocument[];
  tags: Dictionary<TagDocument[]>;
  getTags: (tagRefs?: DocumentReference<TagDocument>[]) => TagDocument[];
  loading: boolean;
}

const BoardsContext = createContext<IBoardsContext>({
  boards: undefined,
  tags: {},
  getTags: () => [],
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
      where("users", "array-contains", user?.email)
    ).withConverter(firestoreConverter)
  );

  const [tags, loadingTags] = useBoardsCollectionsData<TagDocument>(
    boards ?? [],
    Collection.tags
  );

  const [loading] = useDebouncedValue(loadingBoards || loadingTags, 200);

  const context = useMemo(() => {
    const orderedTags = orderBy(tags, (tag) => sanitize(String(tag.name)));

    return {
      boards,
      tags: groupBy(orderedTags, (tag) => tag.ref?.parent.parent?.id),
      getTags: (tags?: DocumentReference<TagDocument>[]) => {
        const tagIds = (tags ?? []).map((tagRef) => tagRef.id);

        return orderedTags.filter((tag) => {
          return tagIds.includes(String(tag.id));
        });
      },
      loading,
    };
  }, [boards, tags, loading]);

  if (loading) {
    return <FullPageLoading />;
  }

  return (
    <BoardsContext.Provider value={context}>{children}</BoardsContext.Provider>
  );
};

export default BoardsProvider;
