import { Group, Indicator, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import TagSelect from "components/molecules/Select/Tag";
import dayjs from "dayjs";
import { updateDoc } from "firebase/firestore";
import { FC } from "react";
import { BoardDocument, NoteDocument } from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import { formatDate } from "utils/dayjs";

export interface NoteModalHeaderProps {
  board: BoardDocument;
  note: NoteDocument;
}

const NoteModalHeader: FC<NoteModalHeaderProps> = ({ board, note }) => {
  return (
    <Group grow>
      <TextInput
        className="w-full"
        placeholder="Nom de la note"
        defaultValue={note?.name}
        onChange={(event) => {
          if (note.ref) {
            updateDoc<NoteDocument>(note.ref, {
              name: event.target.value,
            });
          }
        }}
      />
      <Group grow>
        <DatePicker
          locale="fr"
          value={dayjs(note.date).toDate()}
          onChange={(date) => {
            if (note.ref) {
              updateDoc<NoteDocument>(note.ref, {
                date: formatDate(date, "YYYY-MM-DD"),
              });
            }
          }}
          clearable={false}
        />
        {board?.tags?.length ? (
          <TagSelect
            rightSection={<div />}
            icon={
              note.tag ? (
                <Indicator color={getColorFromString(note.tag)}>
                  <div />
                </Indicator>
              ) : undefined
            }
            placeholder="Étiquette"
            board={board}
            value={note.tag}
            onChange={(tag) => {
              if (note.ref) {
                updateDoc<NoteDocument>(note.ref, {
                  tag: tag ?? "",
                });
              }
            }}
          />
        ) : undefined}
      </Group>
    </Group>
  );
};

export default NoteModalHeader;
