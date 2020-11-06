import { db } from "config/firebase";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { logError } from "utils";

const cleanDoc = (doc) => {
  if (doc.exists) {
    return { uid: doc.id, ref: doc.ref, ...doc.data() };
  }

  return undefined;
};

const cleanSnapshot = (snapshot) => {
  if (Array.isArray(snapshot.docs)) {
    return snapshot.docs
      .map((doc) => {
        return cleanDoc(doc);
      })
      .filter(Boolean);
  }

  return cleanDoc(snapshot);
};

export const useListenData = ({ collection, id, src, where } = {}) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = src || db;
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
    unsubscribe.onSnapshot(
      (snapshot) => {
        setData(cleanSnapshot(snapshot));
        setLoading(false);
      },
      (error) => {
        setData();
        setLoading(false);
        logError(error);
      }
    );

    // Unsubcribe
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, id, src, JSON.stringify(where)]);

  return useMemo(() => [data, loading], [data, loading]);
};
