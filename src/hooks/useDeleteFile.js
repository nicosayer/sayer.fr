import { storage } from "config/firebase";
import { useState } from "react";
import { logError } from "utils";

export const useDeleteFile = () => {
  const [loading, setLoading] = useState(false);

  return [
    ({ ref, onSuccess = () => {} }) => {
      setLoading(true);
      return storage
        .ref(ref)
        .delete()
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
