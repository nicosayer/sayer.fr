import { fromBase64, toBase64 } from "@aws-sdk/util-base64";
import { RichTextEditor } from "@mantine/tiptap";
import Collaboration from "@tiptap/extension-collaboration";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { BubbleMenu, FloatingMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { updateDoc } from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import { NoteDocument } from "types/firebase/collections";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

export interface NoteModalContentProps {
  note: NoteDocument;
}

const NoteModalContent: FC<NoteModalContentProps> = ({ note }) => {
  const [yDoc] = useState(() => {
    const yDoc = new Y.Doc();
    if (note.content) {
      Y.applyUpdate(yDoc, fromBase64(note.content));
    }
    return yDoc;
  });

  useEffect(() => {
    if (note.id) {
      const provider = new WebrtcProvider(String(note.id), yDoc);

      return () => {
        provider.destroy();
      };
    }
  }, [note.id, yDoc]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: yDoc,
      }),
      Underline,
      Link,
      Highlight,
    ],
    autofocus: "end",
    onUpdate: () => {
      if (note?.ref) {
        updateDoc<NoteDocument>(note.ref, {
          content: toBase64(Y.encodeStateAsUpdate(yDoc)),
        });
      }
    },
  });

  return (
    <RichTextEditor editor={editor} className="h-full overflow-auto">
      <RichTextEditor.Toolbar sticky>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
          <RichTextEditor.ClearFormatting />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.Hr />

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.CodeBlock />
          <RichTextEditor.Blockquote />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export default NoteModalContent;
