import { Modal } from "@mantine/core";
import classNames from "classnames";
import { deleteDoc } from "firebase/firestore";
import useColors from "hooks/useColors";
import { FC, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import NoteModalContent from "routes/Home/Boards/Board/Notes/Note/NoteModalContent";
import NoteModalHeader from "routes/Home/Boards/Board/Notes/Note/NoteModalHeader";
import { useBoard } from "routes/Home/Boards/Board/Provider";

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
        fullScreen
        classNames={{
          body: "mt-4 h-[calc(100%_-_85px)]",
          title: "w-full mr-4",
          header: classNames(
            "border-0 border-b border-solid",
            darkMode ? "border-[#2C2E33]" : "border-[#e9ecef]"
          ),
          content: darkMode ? "bg-[#141517]" : "bg-[#f8f9fa]",
        }}
        title={<NoteModalHeader note={note} />}
      >
        <NoteModalContent note={note} />
      </Modal>
    </>
  );
};

export default Note;
