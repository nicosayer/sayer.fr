import { db } from "config/firebase";
import { useState } from "react";
import { logError } from "utils";
import { cleanSnapshot } from "utils/firebase";

export const useReadData = () => {
  const [loading, setLoading] = useState(false);

  return [
    ({
      collection,
      id,
      src,
      onSuccess = () => null,
      onError = () => null,
      where,
    }) => {
      setLoading(true);
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
      return query
        .get()
        .then((snapshot) => {
          setLoading(false);
          onSuccess();
          return cleanSnapshot(snapshot);
        })
        .catch((error) => {
          setLoading(false);
          logError(error);
          onError();
        });
    },
    loading,
  ];
};
