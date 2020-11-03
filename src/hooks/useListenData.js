import { db } from "config/firebase";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";

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

export const useListenData = ({ collection, id, src } = {}) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    let query = src || db;
    if (collection) {
      query = query.collection(collection);
    }
    if (id) {
      query = query.doc(id);
    }
    query.onSnapshot(
      (snapshot) => {
        setData(cleanSnapshot(snapshot));
        setLoading(false);
        setError();
      },
      (error) => {
        setData();
        setLoading(false);
        setError(error);
      }
    );
  }, [collection, id, src]);

  return useMemo(() => [data, loading, error], [data, loading, error]);
};
