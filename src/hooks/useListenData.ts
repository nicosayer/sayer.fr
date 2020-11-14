import { db } from "config/firebase";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { log } from "utils";
import { cleanSnapshot } from "utils/firebase";
import firebase from "firebase/app";

export const useListenData = ({
  collection,
  id,
  src,
  where,
  skip,
}: {
  collection?: string;
  id?: string;
  src?: firebase.firestore.DocumentReference;
  where?: [string, string, string][];
  skip?: boolean;
}) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(!skip);

  useEffect(() => {
    if (skip) {
      return;
    }

    let unsubscribe: any = src || db;
    if (collection) {
      unsubscribe = unsubscribe.collection(collection);
    }
    if (id) {
      unsubscribe = unsubscribe.doc(id);
    }
    if (where) {
      where.forEach((w) => {
        unsubscribe = unsubscribe.where(...w);
      });
    }
    (unsubscribe as firebase.firestore.Query).onSnapshot(
      (snapshot) => {
        setData(cleanSnapshot(snapshot));
        setLoading(false);
      },
      (error) => {
        setData({});
        setLoading(false);
        log(error);
      }
    );

    // Unsubcribe
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, id, src, JSON.stringify(where), skip]);

  return useMemo(() => [data, loading], [data, loading]);
};
