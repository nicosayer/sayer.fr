import { db } from "config/firebase";
import { useState } from "react";
import { logError, uniqueId } from "utils";

export const useWriteData = () => {
  const [loading, setLoading] = useState(false);

  return [
    ({ collection, id = uniqueId(), data, src, onSuccess = () => {} }) => {
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
          onSuccess();
        })
        .catch((error) => {
          setLoading(false);
          logError(error);
        });
    },
    loading,
  ];
};
