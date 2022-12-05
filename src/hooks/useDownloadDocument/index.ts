import { storage } from "configs/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import useBooleanState from "hooks/useBooleanState";
import { useMemo } from "react";
import useDownloader from "react-use-downloader";
import { DocumentDocument, Mime } from "types/firebase/collections";
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
              document.mime as Mime
            )}`
          )
        )
          .then((url) => {
            return download(
              url,
              `${document.name}${
                document.tag ? ` - ${document.tag.toUpperCase()}` : ""
              }.${getExtension(document.mime as Mime)}`
            );
          })
          .finally(stop);
      },
      loading,
    ];
  }, [download, loading, start, stop]);
};

export default useDownloadDocument;
