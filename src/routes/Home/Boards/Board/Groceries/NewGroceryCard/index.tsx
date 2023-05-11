import { ActionIcon, Card, Group, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { collection, Timestamp } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useCallback, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Collection, GroceryDocument } from "types/firebase/collections";
import { addDoc, auth } from "utils/firebase";
import { cleanString } from "utils/string";
import { useBoard } from "../../Provider";

const NewGroceryCard: FC = () => {
  const { board } = useBoard();
  const [user] = useAuthState(auth);
  const [loading, start, stop] = useBooleanState();
  const [value, setValue] = useState("");

  const formattedValue = useMemo(() => {
    return cleanString(value);
  }, [value]);

  const handleSubmit = useCallback(() => {
    if (board?.id && board.ref && user?.email && formattedValue) {
      start();
      addDoc<GroceryDocument>(collection(board.ref, Collection.groceries), {
        name: formattedValue,
        openedBy: user.email,
        openedAt: Timestamp.now(),
      })
        .then(() => {
          setValue("");
        })
        .finally(stop);
    }
  }, [board?.id, board?.ref, start, stop, user?.email, formattedValue]);

  return (
    <Card withBorder>
      <Group position="apart" noWrap>
        <div className="flex items-center w-full gap-2">
          <ActionIcon
            type="submit"
            variant="light"
            loading={loading}
            color={formattedValue ? "blue" : undefined}
            onClick={handleSubmit}
          >
            <IconPlus size={18} />
          </ActionIcon>
          <TextInput
            disabled={loading}
            data-autofocus
            autoFocus
            withAsterisk
            className="w-full"
            variant="unstyled"
            placeholder="Nouvelle course"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmit();
              }
            }}
          />
        </div>
      </Group>
    </Card>
  );
};

export default NewGroceryCard;
