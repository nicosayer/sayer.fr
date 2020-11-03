import { db } from "config/firebase";
import { useState } from "react";
import { uniqueId } from "utils";

export const useWriteData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return [
    ({ collection, id = uniqueId(), data, src,callback }) => {
      setLoading(true);
      let mutation = src || db;
      if (collection) {
        mutation = mutation.collection(collection);
      }
      return mutation
        .doc(id)
        .set(data)
        .then(() => {
          setLoading(false);
          setError();
          callback();
        })
        .catch((error) => {
          setLoading(false);
          setError(error);
        });
    },
    loading,
    error,
  ];
};
