import { toBase64 } from "@aws-sdk/util-base64";
import { DEFAULT_THEME } from "@mantine/core";
import { RichTextEditor as MantineRichTextEditor } from "@mantine/tiptap";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import useWindowSize from "hooks/useWindowSize";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { NoteDocument } from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import { auth, updateDoc } from "utils/firebase";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

export interface RichTextEditorProps {
  note: NoteDocument;
  yDoc: Y.Doc;
  provider: WebrtcProvider;
}

const RichTextEditor: FC<RichTextEditorProps> = ({ yDoc, provider, note }) => {
  const [user] = useAuthState(auth);
  const { largerThan } = useWindowSize();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: yDoc,
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: user?.email,
          color:
            DEFAULT_THEME.colors[getColorFromString(String(user?.email))][6],
        },
        render: (user) => {
          const cursor = document.createElement("span");
          cursor.setAttribute(
            "style",
            `border-left: 1px solid #0d0d0d; border-right: 1px solid #0d0d0d; margin-left: -1px; margin-right: -1px; pointer-events: none; position: relative; word-break: normal; border-color: ${user.color};`
          );

          const label = document.createElement("div");
          label.setAttribute(
            "style",
            `border-radius: 3px 3px 3px 0; color: white; font-size: 12px; font-style: normal; font-weight: 600; left: -1px; line-height: normal; padding: 0.1rem 0.3rem; position: absolute; top: -1.4em; -webkit-user-select: none; -moz-user-select: none; user-select: none; white-space: nowrap; background-color: ${user.color};`
          );

          label.insertBefore(document.createTextNode(user.name), null);
          cursor.insertBefore(label, null);

          return cursor;
        },
      }),
      Underline,
      Link,
      Highlight,
      TextStyle,
      Color,
    ].filter(Boolean),
    autofocus: "end",
    onUpdate: ({ editor }) => {
      if (note?.ref) {
        updateDoc<NoteDocument>(note.ref, {
          base64: toBase64(Y.encodeStateAsUpdate(yDoc)),
          text: editor.getText().replace(/\s+/g, " "),
        });
      }
    },
  });

  return (
    <MantineRichTextEditor
      editor={editor}
      className="max-w-4xl max-h-full m-auto overflow-auto"
      styles={{
        content: {
          "& .ProseMirror": {
            minHeight: "200px",
          },
        },
      }}
    >
      {largerThan("md") && (
        <MantineRichTextEditor.Toolbar sticky>
          <MantineRichTextEditor.ColorPicker
            colors={[
              "#25262b",
              "#868e96",
              "#fa5252",
              "#e64980",
              "#be4bdb",
              "#7950f2",
              "#4c6ef5",
              "#228be6",
              "#15aabf",
              "#12b886",
              "#40c057",
              "#82c91e",
              "#fab005",
              "#fd7e14",
            ]}
          />
          <MantineRichTextEditor.ControlsGroup>
            <MantineRichTextEditor.Bold />
            <MantineRichTextEditor.Italic />
            <MantineRichTextEditor.Underline />
            <MantineRichTextEditor.Strikethrough />
            <MantineRichTextEditor.Highlight />
            <MantineRichTextEditor.Code />
            <MantineRichTextEditor.ClearFormatting />
          </MantineRichTextEditor.ControlsGroup>

          <MantineRichTextEditor.ControlsGroup>
            <MantineRichTextEditor.H1 />
            <MantineRichTextEditor.H2 />
            <MantineRichTextEditor.H3 />
          </MantineRichTextEditor.ControlsGroup>

          <MantineRichTextEditor.Hr />

          <MantineRichTextEditor.ControlsGroup>
            <MantineRichTextEditor.CodeBlock />
            <MantineRichTextEditor.Blockquote />
          </MantineRichTextEditor.ControlsGroup>

          <MantineRichTextEditor.ControlsGroup>
            <MantineRichTextEditor.BulletList />
            <MantineRichTextEditor.OrderedList />
          </MantineRichTextEditor.ControlsGroup>
        </MantineRichTextEditor.Toolbar>
      )}

      <MantineRichTextEditor.Content />
    </MantineRichTextEditor>
  );
};

export default RichTextEditor;
