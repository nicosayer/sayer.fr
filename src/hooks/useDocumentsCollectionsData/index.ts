import {
  collection as firestoreCollection,
  DocumentReference,
  onSnapshot,
} from "firebase/firestore";
import { flatMap, pick } from "lodash";
import { useSecureLogin } from "providers/SecureLogin";
import { useEffect, useMemo, useState } from "react";
import { Collection } from "types/firebase/collections";
import { spreadSnapshot } from "utils/firebase";

const useDocumentsCollectionsData = <T>(
  documents: { id?: string; ref?: DocumentReference }[],
  collection: Collection
) => {
  const [data, setData] = useState<Record<string, T[]>>();
  const { isSecure } = useSecureLogin();

  useEffect(() => {
    const documentIds = documents.map((document) => document.id as string);

    const unsubscribes = documents.map((document) => {
      if (document.ref === undefined) {
        return () => {};
      }

      return onSnapshot(
        firestoreCollection(document.ref, collection),
        (querySnapshot) => {
          setData((old) => {
            return {
              ...pick(old ?? {}, documentIds),
              [String(document.id)]: querySnapshot.docs.map((snapshot) => {
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
  }, [documents, collection, isSecure]);

  return useMemo(() => {
    return [
      flatMap(data),
      data === undefined || Object.keys(data).length !== documents.length,
    ] as const;
  }, [documents.length, data]);
};

export default useDocumentsCollectionsData;
