import { RichTextEditor } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { updateDoc } from "firebase/firestore";
import { FC } from "react";
import { NoteDocument } from "types/firebase/collections";

export interface NoteModalContentProps {
  note: NoteDocument;
}

const NoteModalContent: FC<NoteModalContentProps> = ({ note }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight,
      Placeholder.configure({ placeholder: "Commenez à écrire votre note" }),
    ],
    autofocus: "end",
    content: note?.content,
    onUpdate: ({ editor }) => {
      if (note?.ref) {
        updateDoc<NoteDocument>(note.ref, {
          content: editor.getHTML(),
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
          <RichTextEditor.ClearFormatting />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.Hr />

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Code />
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
