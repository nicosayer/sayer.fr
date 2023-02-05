import { Card } from "@mantine/core";
import NoteCardContent from "components/organisms/NoteCardContent";
import { FC } from "react";
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
