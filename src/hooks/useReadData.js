import { db } from "config/firebase";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { logError } from "utils";
import { cleanSnapshot } from "utils/firebase";

export const useReadData = ({ collection, id, src, where } = {}) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = src || db;
    if (collection) {
      query = query.collection(collection);
    }
    if (id) {
      query = query.doc(id);
    }
    if (where) {
      where.forEach((w) => {
        query = query.where(...w);
      });
    }
    query
      .get()
      .then((snapshot) => {
        setData(cleanSnapshot(snapshot));
        setLoading(false);
      })
      .catch((error) => {
        setData();
        setLoading(false);
        logError(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, id, src, JSON.stringify(where)]);

  return useMemo(() => [data, loading], [data, loading]);
};
