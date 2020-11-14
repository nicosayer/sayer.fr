import { storage } from "config/firebase";
import { useState } from "react";
import { log } from "utils";

export const useDeleteFile = () => {
  const [loading, setLoading] = useState(false);

  return [
    ({ ref, onSuccess = () => null, onError = () => null }) => {
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
          log(error);
          onError();
        });
    },
    loading,
  ];
};
