import { ActionIcon, Card, Group, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { collection, Timestamp } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useCallback, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Collection, TaskDocument } from "types/firebase/collections";
import { addDoc, auth } from "utils/firebase";
import { useBoard } from "../../Provider";

const NewTaskCard: FC = () => {
  const { board } = useBoard();
  const [user] = useAuthState(auth);
  const [loading, start, stop] = useBooleanState();
  const [value, setValue] = useState("");

  const formattedValue = useMemo(() => {
    return value.trim().replace(/ +/g, " ");
  }, [value]);

  const handleSubmit = useCallback(() => {
    if (board?.id && board.ref && user?.email && formattedValue) {
      start();
      addDoc<TaskDocument>(collection(board.ref, Collection.tasks), {
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
            variant="light"
            type="submit"
            loading={loading}
            color={formattedValue ? "blue" : undefined}
            onClick={handleSubmit}
          >
            <IconPlus size={18} />
          </ActionIcon>
          <TextInput
            disabled={loading}
            data-autofocus
            withAsterisk
            className="w-full"
            variant="unstyled"
            placeholder="Nouvelle tâche"
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

export default NewTaskCard;
