import { db } from "config/firebase";
import { useToaster } from "providers/ToasterProvider";
import { useState } from "react";
import { logError } from "utils";

export const useWriteData = () => {
  const [loading, setLoading] = useState(false);
  const { dangerToast } = useToaster();

  return [
    ({
      collection,
      id,
      data,
      src,
      onSuccess = () => null,
      options,
      onError = () => {
        dangerToast({ icon: "warning-sign", message: "An unexpected error occured" });
      },
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
          logError(error, { type: "useWriteData", collection, id, data });
          onError();
        });
    },
    loading,
  ];
};
