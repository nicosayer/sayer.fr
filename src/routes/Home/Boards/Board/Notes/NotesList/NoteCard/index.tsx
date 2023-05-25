import { Card } from "@mantine/core";
import { FC } from "react";
import { NoteDocument } from "types/firebase/collections";
import NoteCardContent from "./NoteCardContent";

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
