import { ActionIcon, Badge, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useState } from "react";
import {
  BoardDocument,
  Collection,
  TagDocument,
} from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import { addDoc } from "utils/firebase";
import { cleanString } from "utils/string";

export interface NewTagBadgeProps {
  board: BoardDocument;
  tags: TagDocument[];
}

const NewTagBadge: FC<NewTagBadgeProps> = ({ board, tags }) => {
  const [loading, start, stop] = useBooleanState();
  const [value, setValue] = useState("");

  return (
    <Badge
      size="lg"
      color="gray"
      variant="light"
      leftSection={
        <ActionIcon size="xs" variant="transparent" className="-ml-[6px]">
          <IconPlus size={10} />
        </ActionIcon>
      }
    >
      <TextInput
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        disabled={loading}
        variant="unstyled"
        placeholder="Nouvelle étiquette"
        onBlur={() => {
          const formattedValue = cleanString(value).toLowerCase();

          if (
            formattedValue &&
            !tags.some((tag) => tag.name === formattedValue) &&
            board?.ref
          ) {
            start();
            addDoc(collection(board?.ref, Collection.tags), {
              name: formattedValue,
              color: getColorFromString(formattedValue),
            })
              .then(() => {
                setValue("");
              })
              .finally(stop);
          } else {
            setValue("");
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
      />
    </Badge>
  );
};

export default NewTagBadge;
