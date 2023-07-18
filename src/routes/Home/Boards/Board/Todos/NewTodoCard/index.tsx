import { ActionIcon, Card, Group, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { collection, Timestamp } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useCallback, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { Collection, TodoDocument } from "types/firebase/collections";
import { addDoc, auth } from "utils/firebase";

const NewTodoCard: FC = () => {
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
      addDoc<TodoDocument>(collection(board.ref, Collection.todos), {
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
            data-autofocus
            autoFocus
            withAsterisk
            className="w-full"
            variant="unstyled"
            placeholder="Nouveau todo"
            value={value}
            onChange={(event) => {
              if (!loading) {
                setValue(event.target.value);
              }
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

export default NewTodoCard;
