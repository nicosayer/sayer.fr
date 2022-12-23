import { ActionIcon, Autocomplete, Card, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons";
import BoardSelect from "components/molecules/Select/Board";
import TagSelect from "components/molecules/Select/Tag";
import dayjs from "dayjs";
import { addDoc, collection, deleteDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useCallback, useMemo, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Collection, GroceryDocument } from "types/firebase/collections";
import { auth } from "utils/firebase";
import { useBoard } from "../../Provider";

const NewGroceryCard: FC = () => {
  const { boards, groceries } = useBoard();
  const [user] = useAuthState(auth);
  const is768Px = useMediaQuery("(min-width: 768px)");
  const [loading, start, stop] = useBooleanState();
  const formRef = useRef<HTMLFormElement>(null);
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

  const handleSubmit = useCallback(
    (values: typeof form.values) => {
      const board = boards?.find((board) => board.id === values.boardId);

      if (board?.id && board.ref) {
        start();
        localStorage.setItem("default-board-id", board.id);
        const name = values.name.trim();
        addDoc<GroceryDocument>(collection(board.ref, Collection.groceries), {
          name,
          order: +dayjs(),
          openedBy: user?.email ?? "",
          openDate: dayjs().format("YYYY-MM-DD"),
          tag: values.tag,
        })
          .then(() => {
            return groceries
              ?.filter((grocery) => grocery.name === name)
              .forEach((grocery) => {
                if (grocery.ref) {
                  deleteDoc(grocery.ref);
                }
              });
          })
          .finally(stop);
      }
    },
    [boards, form, groceries, start, stop, user?.email]
  );

  const onSubmit = useCallback(() => {
    const validate = form.validate();
    if (!validate.hasErrors) {
      formRef.current?.dispatchEvent(
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
      <form ref={formRef} onSubmit={form.onSubmit(handleSubmit)}>
        <Group position="apart" noWrap>
          <div className="flex items-center w-full gap-2">
            <ActionIcon
              variant="light"
              color={form.values.name ? "blue" : undefined}
              onClick={onSubmit}
            >
              <IconPlus size={18} />
            </ActionIcon>
            <Autocomplete
              autoFocus
              withinPortal
              data-autofocus
              data={
                form.values.name
                  ? (groceries ?? [])
                      .filter((grocery) => grocery.closeDate)
                      .map((grocery) => grocery.name)
                  : []
              }
              withAsterisk
              className="w-full"
              variant="unstyled"
              placeholder="Nouvelle course"
              onKeyUp={({ code }) => {
                if (code === "Enter" && form.values.name) {
                  onSubmit();
                }
              }}
              onItemSubmit={(item) => {
                const validate = form.validate();

                if (!validate.hasErrors) {
                  handleSubmit({ ...form.values, name: item.value });

                  form.setValues({
                    name: "",
                    tag: "",
                    boardId: form.values.boardId,
                  });
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
