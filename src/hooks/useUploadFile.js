import { storage } from "config/firebase";
import { useState } from "react";
import { logError, uniqueId } from "utils";

export const useUploadFile = () => {
  const [loading, setLoading] = useState(false);

  return [
    ({ ref = uniqueId(), file, callback = () => {} }) => {
      setLoading(true);
      return storage
        .ref(ref)
        .put(file)
        .then((snapshot) => {
          setLoading(false);
          callback(snapshot);
        })
        .catch((error) => {
          setLoading(false);
          logError(error);
        });
    },
    loading,
  ];
};
