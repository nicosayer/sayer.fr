import { Group, TextInput } from "@mantine/core";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import TagsMultiSelect from "components/molecules/MultiSelect/Tags";
import dayjs from "dayjs";
import { doc } from "firebase/firestore";
import { FC, useEffect, useMemo, useState } from "react";
import { useBoards } from "routes/Home/Boards/Provider";
import { NoteDocument } from "types/firebase/collections";
import { formatDate } from "utils/dayjs";
import { db, updateDoc } from "utils/firebase";
import { ONE_SECOND } from "utils/time";

export interface NoteModalHeaderProps {
  note: NoteDocument;
}

const NoteModalHeader: FC<NoteModalHeaderProps> = ({ note }) => {
  const { tags: boardsTags } = useBoards();
  const is768Px = useMediaQuery("(min-width: 768px)", true);
  const [name, setName] = useState(note?.name);
  const [debouncedName] = useDebouncedValue(note?.name, 10 * ONE_SECOND);

  const tags = useMemo(() => {
    return boardsTags[String(note.ref?.parent.parent?.id)] ?? [];
  }, [boardsTags, note.ref?.parent.parent?.id]);

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
      {tags?.length ? (
        <TagsMultiSelect
          placeholder="Étiquettes"
          tags={tags}
          value={(note.tags ?? []).map((tag) => tag.path)}
          onChange={(tags) => {
            if (note.ref) {
              updateDoc<NoteDocument>(note.ref, {
                tags: tags.map((tag) => {
                  return doc(db, tag);
                }),
              });
            }
          }}
        />
      ) : undefined}
    </Group>
  );
};

export default NoteModalHeader;
