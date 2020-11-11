import { db } from "config/firebase";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { logError } from "utils";

const cleanDoc = (doc) => {
  return { uid: doc.id, ref: doc.ref, ...doc.data() };
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

export const useListenData = ({ collection, id, src, where, skip } = {}) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(!skip);

  useEffect(() => {
    if (skip) {
      return;
    }

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
        logError(error, { type: "useListenData", collection, id, where });
      }
    );

    // Unsubcribe
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, id, src, JSON.stringify(where), skip]);

  return useMemo(() => [data, loading], [data, loading]);
};
