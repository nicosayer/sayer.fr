import { Card } from "@mantine/core";
import { FC } from "react";
import NoteCardContent from "routes/Home/Boards/Board/Notes/NotesList/NoteCard/NoteCardContent";
import { NoteDocument } from "types/firebase/collections";

export interface NoteCardProps {
  note: NoteDocument;
}

const NoteCard: FC<NoteCardProps> = ({ note }) => {
  return (
    <Card withBorder>
      <NoteCardContent note={note} />
    </Card>
  );
};

export default NoteCard;
