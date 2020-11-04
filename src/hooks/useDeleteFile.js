import { storage } from "config/firebase";
import { useState } from "react";
import { logError } from "utils";

export const useDeleteFile = () => {
  const [loading, setLoading] = useState(false);

  return [
    ({ ref, callback = () => {} }) => {
      setLoading(true);
      return storage
        .ref(ref)
        .delete()
        .then(() => {
          setLoading(false);
          callback();
        })
        .catch((error) => {
          setLoading(false);
          logError(error);
        });
    },
    loading,
  ];
};
