import { db } from "config/firebase";
import { useState } from "react";

export const useDeleteData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return [
    ({ collection, id, src, callback }) => {
      setLoading(true);
      let mutation = src || db;
      if (collection) {
        mutation = mutation.collection(collection);
      }
      if (id) {
        mutation = mutation.doc(id);
      }
      return mutation
        .delete()
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
