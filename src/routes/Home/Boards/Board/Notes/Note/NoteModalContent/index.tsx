import { fromBase64, toBase64 } from "@aws-sdk/util-base64";
import { RichTextEditor } from "@mantine/tiptap";
import Collaboration from "@tiptap/extension-collaboration";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { BubbleMenu, FloatingMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { updateDoc } from "firebase/firestore";
import { FC, useEffect } from "react";
import { NoteDocument } from "types/firebase/collections";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

export interface NoteModalContentProps {
  note: NoteDocument;
}

const ydoc = new Y.Doc();

const NoteModalContent: FC<NoteModalContentProps> = ({ note }) => {
  useEffect(() => {
    if (note.content) {
      Y.applyUpdate(ydoc, fromBase64(note.content));
    }
  });

  useEffect(() => {
    if (note.id) {
      const provider = new WebrtcProvider(String(note.id), ydoc);

      return () => {
        provider.destroy();
      };
    }
  }, [note.id]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      Underline,
      Link,
      Highlight,
    ],
    autofocus: "end",
    onUpdate: ({ editor }) => {
      if (note?.ref) {
        updateDoc<NoteDocument>(note.ref, {
          content: toBase64(Y.encodeStateAsUpdate(ydoc)),
        });
      }
    },
  });

  return (
    <RichTextEditor editor={editor} className="h-full overflow-auto">
      <RichTextEditor.Toolbar sticky>
        {editor && (
          <BubbleMenu editor={editor}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
              <RichTextEditor.ClearFormatting />
            </RichTextEditor.ControlsGroup>
          </BubbleMenu>
        )}
        {editor && (
          <FloatingMenu editor={editor}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>
          </FloatingMenu>
        )}
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
