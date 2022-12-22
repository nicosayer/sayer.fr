import { fromBase64 } from "@aws-sdk/util-base64";
import { FC, useEffect, useState } from "react";
import { NoteDocument } from "types/firebase/collections";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import RichTextEditor from "./RichTextEditor";

export interface NoteModalContentProps {
  note: NoteDocument;
}

const NoteModalContent: FC<NoteModalContentProps> = ({ note }) => {
  const [providerRef, setProviderRef] = useState<WebrtcProvider>();

  const [yDoc] = useState(() => {
    const yDoc = new Y.Doc();
    if (note.content) {
      Y.applyUpdate(yDoc, fromBase64(note.content));
    }
    return yDoc;
  });

  useEffect(() => {
    if (note.id) {
      new IndexeddbPersistence(note.id, yDoc);
    }
  }, [note.id, yDoc]);

  useEffect(() => {
    if (note.id) {
      const provider = new WebrtcProvider(note.id, yDoc);

      setProviderRef(provider);

      return () => {
        provider.destroy();
      };
    }
  }, [note.id, yDoc]);

  if (!providerRef) {
    return null;
  }

  return <RichTextEditor note={note} yDoc={yDoc} provider={providerRef} />;
};

export default NoteModalContent;
