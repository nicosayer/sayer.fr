import { getDownloadURL, ref } from "firebase/storage";
import useBooleanState from "hooks/useBooleanState";
import { useMemo } from "react";
import useDownloader from "react-use-downloader";
import { DocumentDocument, DocumentMime } from "types/firebase/collections";
import { storage } from "utils/firebase";
import { getExtension } from "utils/storage";

const useDownloadDocument = (): [
  (document: DocumentDocument) => void,
  boolean
] => {
  const { download } = useDownloader();
  const [loading, start, stop] = useBooleanState();

  return useMemo(() => {
    return [
      (document) => {
        start();
        getDownloadURL(
          ref(
            storage,
            `${document.ref?.path}/document.${getExtension(
              document.mime as DocumentMime
            )}`
          )
        )
          .then((url) => {
            return download(
              url,
              `${document.name}.${getExtension(document.mime as DocumentMime)}`
            );
          })
          .finally(stop);
      },
      loading,
    ];
  }, [download, loading, start, stop]);
};

export default useDownloadDocument;
