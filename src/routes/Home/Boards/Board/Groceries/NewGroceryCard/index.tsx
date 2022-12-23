import { ActionIcon, Card, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { closeAllModals } from "@mantine/modals";
import { IconPlus } from "@tabler/icons";
import BoardSelect from "components/molecules/Select/Board";
import TagSelect from "components/molecules/Select/Tag";
import dayjs from "dayjs";
import { addDoc, collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useCallback, useMemo, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Collection, GroceryDocument } from "types/firebase/collections";
import { auth } from "utils/firebase";
import { useBoard } from "../../Provider";

const NewGroceryCard: FC = () => {
  const { boards } = useBoard();
  const [user] = useAuthState(auth);
  const is768Px = useMediaQuery("(min-width: 768px)");
  const [loading, start, stop] = useBooleanState();
  const ref = useRef<HTMLFormElement>(null);
  const form = useForm({
    initialValues: {
      name: "",
      tag: "",
      boardId:
        boards?.length === 1
          ? boards[0].id
          : localStorage.getItem("default-board-id") ?? undefined,
    },

    validate: {
      boardId: (boardId?: string) => {
        return boards?.find((board) => board.id === boardId) ? null : true;
      },
      name: (name) => {
        return name.length > 0 ? null : true;
      },
    },
  });

  const board = useMemo(() => {
    return boards?.find((board) => board.id === form.values.boardId);
  }, [boards, form.values.boardId]);

  const handleSubmit = useCallback(() => {
    const validate = form.validate();
    if (!validate.hasErrors) {
      ref.current?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
      form.setValues({
        name: "",
        tag: "",
        boardId: form.values.boardId,
      });
    }
  }, [form]);

  return (
    <Card withBorder>
      <form
        ref={ref}
        onSubmit={form.onSubmit((values) => {
          const board = boards?.find((board) => board.id === values.boardId);

          if (board?.id && board.ref) {
            start();
            localStorage.setItem("default-board-id", board.id);
            addDoc<GroceryDocument>(
              collection(board.ref, Collection.groceries),
              {
                name: values.name.trim(),
                order: +dayjs(),
                openedBy: user?.email ?? "",
                openDate: dayjs().format("YYYY-MM-DD"),
                tag: values.tag,
              }
            )
              .then(() => closeAllModals())
              .finally(stop);
          }
        })}
      >
        <Group position="apart" noWrap>
          <div className="flex items-center w-full gap-2">
            <ActionIcon
              variant="light"
              color={form.values.name ? "blue" : undefined}
              onClick={handleSubmit}
            >
              <IconPlus size={18} />
            </ActionIcon>
            <TextInput
              autoFocus
              data-autofocus
              withAsterisk
              className="w-full"
              variant="unstyled"
              disabled={loading}
              placeholder="Nouvelle course"
              onKeyDown={({ code }) => {
                if (code === "Enter") {
                  handleSubmit();
                }
              }}
              {...form.getInputProps("name")}
            />
          </div>
          {(boards?.length ?? 0) > 1 && (
            <BoardSelect
              boards={boards}
              loading={loading}
              placeholder="Board"
              {...form.getInputProps("boardId")}
            />
          )}
          {board?.tags?.length && is768Px ? (
            <TagSelect
              placeholder="Étiquette"
              board={board}
              loading={loading}
              {...form.getInputProps("tag")}
            />
          ) : undefined}
        </Group>
      </form>
    </Card>
  );
};

export default NewGroceryCard;
