import { functions } from "config/firebase";
import { useState } from "react";
import { logError } from "utils";

export const useCallCloudFunction = () => {
  const [loading, setLoading] = useState(false);

  return [
    ({ name, data, onSuccess = () => null, onError = () => null }) => {
      setLoading(true);
      const cloudFunction = functions().httpsCallable(name);
      return cloudFunction(data)
        .then(() => {
          setLoading(false);
          onSuccess();
        })
        .catch((error) => {
          setLoading(false);
          logError(error, { name: "useCallCloudFunction" });
          onError();
        });
    },
    loading,
  ];
};
