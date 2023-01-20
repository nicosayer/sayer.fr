import { Group, Indicator, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons";
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
  const is768Px = useMediaQuery("(min-width: 768px)");
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
      {is768Px && (
        <Group grow>
          <DatePicker
            locale="fr"
            inputFormat="D MMMM YYYY"
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
                ) : (
                  <IconChevronDown size={18} />
                )
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
      )}
    </Group>
  );
};

export default NoteModalHeader;
