import { openModal } from "@mantine/modals";
import { getDownloadURL, ref } from "firebase/storage";
import useBooleanState from "hooks/useBooleanState";
import { useMemo } from "react";
import { DocumentDocument, DocumentMime } from "types/firebase/collections";
import { storage } from "utils/firebase";
import { getExtension } from "utils/storage";

const usePreviewDocument = (): [
  (document: DocumentDocument) => void,
  boolean
] => {
  const [loading, start, stop] = useBooleanState();

  return useMemo(() => {
    return [
      (document) => {
        start();
        getDownloadURL(
          ref(
            storage,
            `${document?.ref?.path}/document.${getExtension(
              document.mime as DocumentMime
            )}`
          )
        )
          .then((url) => {
            openModal({
              centered: true,
              children: (
                <iframe
                  title="Document"
                  src={url}
                  className="w-full h-[80vh] border-0"
                />
              ),
              size: "xl",
              withCloseButton: false,
              padding: 0,
              classNames: { content: "overflow-hidden h-[80vh]" },
            });
          })
          .finally(stop);
      },
      loading,
    ];
  }, [loading, start, stop]);
};

export default usePreviewDocument;
