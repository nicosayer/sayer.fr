import { db } from "config/firebase";
import { useState } from "react";
import { log } from "utils";

export const useWriteData = () => {
  const [loading, setLoading] = useState(false);

  return [
    ({
      collection,
      id,
      data,
      src,
      onSuccess = () => null,
      options,
      onError = () => null,
    }) => {
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
          log(error);
          onError(error);
        });
    },
    loading,
  ];
};
