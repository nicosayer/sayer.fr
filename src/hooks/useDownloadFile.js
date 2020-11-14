import { storage } from "config/firebase";
import { useState } from "react";
import { log, uniqueId } from "utils";
import FileSaver from "file-saver";

export const useDownloadFile = () => {
  const [loading, setLoading] = useState(false);

  return [
    ({
      ref,
      name = uniqueId(),
      onSuccess = () => null,
      onError = () => null,
    }) => {
      setLoading(true);
      return storage
        .ref(ref)
        .getDownloadURL()
        .then((url) => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = () => {
            setLoading(false);
            FileSaver.saveAs(xhr.response, name);
            onSuccess();
          };
          xhr.open("GET", url);
          xhr.send();
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
