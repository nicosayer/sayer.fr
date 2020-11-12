import { db } from "config/firebase";
import { useState } from "react";
import { logError } from "utils";

export const useDeleteData = () => {
  const [loading, setLoading] = useState(false);

  return [
    ({ collection, id, src, onSuccess = () => null, onError = () => null }) => {
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
          onSuccess();
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
