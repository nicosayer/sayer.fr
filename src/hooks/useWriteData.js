import { db } from "config/firebase";
import { useState } from "react";
import { logError } from "utils";

export const useWriteData = () => {
  const [loading, setLoading] = useState(false);

  return [
    ({ collection, id, data, src, onSuccess = () => {}, options }) => {
      setLoading(true);
      let mutation = src || db;
      if (collection) {
        mutation = mutation.collection(collection);
      }
      if (id) {
        mutation = mutation.doc(id);
      }
      return mutation
        .set(data, options)
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
