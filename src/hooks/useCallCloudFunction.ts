import { functions } from "config/firebase";
import { useState } from "react";
import { log } from "utils";

export const useCallCloudFunction = () => {
  const [loading, setLoading] = useState(false);

  return [
    ({
      name,
      data,
      onSuccess = () => null,
      onError = () => null,
    }: {
      name: string;
      data?: Object;
      onSuccess?: () => void;
      onError?: () => void;
    }): Promise<void> => {
      setLoading(true);
      const cloudFunction = functions().httpsCallable(name);
      return cloudFunction(data)
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
