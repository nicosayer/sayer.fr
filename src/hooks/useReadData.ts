import { db } from "config/firebase";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { log } from "utils";
import { cleanSnapshot } from "utils/firebase";
import firebase from "firebase/app";

export const useReadData = ({
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

    let query: any = src || db;
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
    (query as firebase.firestore.Query)
      .get()
      .then((snapshot) => {
        setData(cleanSnapshot(snapshot));
        setLoading(false);
      })
      .catch((error) => {
        setData({});
        setLoading(false);
        log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, id, src, JSON.stringify(where)]);

  return useMemo(() => [data, loading], [data, loading]);
};
