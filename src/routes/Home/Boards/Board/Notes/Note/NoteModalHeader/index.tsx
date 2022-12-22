import { Group, Indicator, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useDebouncedValue } from "@mantine/hooks";
import TagSelect from "components/molecules/Select/Tag";
import dayjs from "dayjs";
import { updateDoc } from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import { BoardDocument, NoteDocument } from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import { formatDate } from "utils/dayjs";
import { ONE_SECOND } from "utils/time";

export interface NoteModalHeaderProps {
  board: BoardDocument;
  note: NoteDocument;
}

const NoteModalHeader: FC<NoteModalHeaderProps> = ({ board, note }) => {
  const [name, setName] = useState(note.name);
  const [debouncedName] = useDebouncedValue(name, ONE_SECOND);

  useEffect(() => {
    if (note.ref && debouncedName && note.name && debouncedName !== note.name) {
      updateDoc<NoteDocument>(note.ref, {
        name: debouncedName,
      });
    }
  }, [debouncedName, note.name, note.ref]);

  return (
    <Group grow>
      <TextInput
        className="w-full"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
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
          placeholder="Pick date"
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
