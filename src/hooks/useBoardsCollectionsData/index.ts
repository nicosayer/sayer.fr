import {
  collection as firestoreCollection,
  DocumentReference,
  onSnapshot,
} from "firebase/firestore";
import useIsSecure from "hooks/useIsSecure";
import { flatMap, pick } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { BoardDocument, Collection } from "types/firebase/collections";
import { spreadSnapshot } from "utils/firebase";

const useBoardsCollectionsData = <T>(
  boards: BoardDocument[],
  collection: Collection
) => {
  const [data, setData] = useState<Record<string, T[]>>();
  const { isSecure } = useIsSecure();

  const boardIds = useMemo(() => {
    return boards.map((board) => board.id as string);
  }, [boards]);

  useEffect(() => {
    const unsubscribes = boards.map((board) => {
      return onSnapshot(
        firestoreCollection(
          board.ref as DocumentReference<BoardDocument>,
          collection
        ),
        (querySnapshot) => {
          setData((old) => {
            return {
              ...pick(old ?? {}, boardIds),
              [String(board.id)]: querySnapshot.docs.map((snapshot) => {
                return spreadSnapshot(snapshot) as T;
              }),
            };
          });
        },
        () => {
          setData((old) => {
            return { ...old };
          });
        }
      );
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [boardIds, boards, collection, isSecure]);

  return useMemo(() => {
    return [
      flatMap(data),
      data === undefined || Object.keys(data).length !== boards.length,
    ] as const;
  }, [boards.length, data]);
};

export default useBoardsCollectionsData;
