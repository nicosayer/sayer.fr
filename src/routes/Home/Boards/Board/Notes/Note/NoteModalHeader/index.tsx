import { Group, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDebouncedValue } from "@mantine/hooks";
import dayjs from "dayjs";
import useWindowSize from "hooks/useWindowSize";
import { FC, useEffect, useState } from "react";
import { NoteDocument } from "types/firebase/collections";
import { formatDate } from "utils/dayjs";
import { updateDoc } from "utils/firebase";
import { ONE_SECOND } from "utils/time";

export interface NoteModalHeaderProps {
  note: NoteDocument;
}

const NoteModalHeader: FC<NoteModalHeaderProps> = ({ note }) => {
  const { largerThan } = useWindowSize();
  const [name, setName] = useState(note?.name);
  const [debouncedName] = useDebouncedValue(note?.name, 10 * ONE_SECOND);

  useEffect(() => {
    setName(debouncedName);
  }, [debouncedName]);

  return (
    <Group grow>
      <TextInput
        className="w-full"
        placeholder="Nom de la note"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          if (note.ref && event.target.value) {
            updateDoc<NoteDocument>(note.ref, {
              name: event.target.value,
            });
          }
        }}
      />
      {largerThan("md") && (
        <Group grow>
          <DatePickerInput
            locale="fr"
            valueFormat="D MMMM YYYY"
            value={dayjs(note.date).toDate()}
            onChange={(date) => {
              if (note.ref && date) {
                updateDoc<NoteDocument>(note.ref, {
                  date: formatDate(date),
                });
              }
            }}
            clearable={false}
          />
        </Group>
      )}
    </Group>
  );
};

export default NoteModalHeader;
