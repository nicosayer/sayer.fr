import { Modal } from "@mantine/core";
import { deleteDoc } from "firebase/firestore";
import useColors from "hooks/useColors";
import { FC, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { useBoard } from "../../Provider";
import NoteModalContent from "./NoteModalContent";
import NoteModalHeader from "./NoteModalHeader";

const Note: FC = () => {
  const { boards, notes } = useBoard();
  const { boardId, noteId } = useParams();
  const navigate = useNavigate();
  const { darkMode, customColors } = useColors();

  const note = useMemo(() => {
    return notes?.find((note) => note.id === noteId);
  }, [noteId, notes]);

  const board = useMemo(() => {
    return boards?.find((board) => board.id === note?.ref?.parent.parent?.id);
  }, [boards, note?.ref?.parent.parent?.id]);

  if (!note || !board) {
    return null;
  }

  return (
    <>
      <Helmet>
        <meta
          name="theme-color"
          content={customColors.background}
          data-react-helmet="true"
        />
      </Helmet>
      <Modal
        opened={Boolean(noteId)}
        onClose={() => {
          if (note.base64 === "AAA=" && note.ref) {
            deleteDoc(note.ref);
          } else {
            navigate(`/boards/${boardId}/notes`);
          }
        }}
        trapFocus={false}
        fullScreen={true}
        classNames={{
          body: "h-[calc(100%_-_52px)]",
          title: "w-full",
          modal: darkMode ? "bg-[#141517]" : "bg-[#f8f9fa]",
        }}
        title={<NoteModalHeader note={note} />}
      >
        <NoteModalContent note={note} />
      </Modal>
    </>
  );
};

export default Note;
