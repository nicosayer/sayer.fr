import { storage } from "config/firebase";
import { useState } from "react";
import { log, uniqueId } from "utils";

export const useUploadFile = () => {
  const [loading, setLoading] = useState(false);

  return [
    ({
      ref = uniqueId(),
      file,
      onSuccess = () => null,
      onError = () => null,
    }) => {
      setLoading(true);
      return storage
        .ref(ref)
        .put(file)
        .then((snapshot) => {
          setLoading(false);
          onSuccess(snapshot);
        })
        .catch((error) => {
          setLoading(false);
          onError(error);
          log(error);
        });
    },
    loading,
  ];
};
