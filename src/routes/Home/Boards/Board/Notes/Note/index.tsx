import { Modal } from "@mantine/core";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBoard } from "../../Provider";
import NoteModalContent from "./NoteModalContent";
import NoteModalHeader from "./NoteModalHeader";

const Note: FC = () => {
  const { boards, notes } = useBoard();
  const { boardId, noteId } = useParams();
  const navigate = useNavigate();

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
    <Modal
      opened={Boolean(noteId)}
      onClose={() => navigate(`/boards/${boardId}/notes`)}
      trapFocus={false}
      fullScreen={true}
      classNames={{ body: "h-[calc(100%_-_52px)]", title: "w-full" }}
      title={<NoteModalHeader board={board} note={note} />}
    >
      <NoteModalContent note={note} />
    </Modal>
  );
};

export default Note;
