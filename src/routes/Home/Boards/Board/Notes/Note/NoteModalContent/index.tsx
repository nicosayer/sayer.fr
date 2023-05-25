import { fromBase64 } from "@aws-sdk/util-base64";
import { FC, useEffect, useState } from "react";
import RichTextEditor from "routes/Home/Boards/Board/Notes/Note/NoteModalContent/RichTextEditor";
import { NoteDocument } from "types/firebase/collections";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

export interface NoteModalContentProps {
  note: NoteDocument;
}

const NoteModalContent: FC<NoteModalContentProps> = ({ note }) => {
  const [providerRef, setProviderRef] = useState<WebrtcProvider>();

  const [yDoc] = useState(() => {
    const yDoc = new Y.Doc();
    if (note.base64) {
      Y.applyUpdate(yDoc, fromBase64(note.base64));
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
