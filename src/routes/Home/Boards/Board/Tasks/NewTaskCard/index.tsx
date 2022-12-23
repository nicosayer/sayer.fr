import { ActionIcon, Card, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons";
import BoardSelect from "components/molecules/Select/Board";
import TagSelect from "components/molecules/Select/Tag";
import dayjs from "dayjs";
import { addDoc, collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useCallback, useMemo, useRef } from "react";
import { Collection, TaskDocument } from "types/firebase/collections";
import { useBoard } from "../../Provider";

const NewTaskCard: FC = () => {
  const { boards } = useBoard();
  const is768Px = useMediaQuery("(min-width: 768px)");
  const [loading, start, stop] = useBooleanState();
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm({
    initialValues: {
      description: "",
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
      description: (description) => {
        return description.length > 0 ? null : true;
      },
    },
  });

  const board = useMemo(() => {
    return boards?.find((board) => board.id === form.values.boardId);
  }, [boards, form.values.boardId]);

  const handleSubmit = useCallback(() => {
    const validate = form.validate();
    if (!validate.hasErrors) {
      formRef.current?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  }, [form]);

  return (
    <Card withBorder>
      <form
        ref={formRef}
        onSubmit={form.onSubmit((values) => {
          const board = boards?.find((board) => board.id === values.boardId);

          if (board?.id && board.ref) {
            start();
            localStorage.setItem("default-board-id", board.id);
            addDoc<TaskDocument>(collection(board.ref, Collection.tasks), {
              description: values.description.trim(),
              order: +dayjs(),
              date: dayjs().format("YYYY-MM-DD"),
              tag: values.tag,
            })
              .then(() => {
                form.setValues({
                  description: "",
                  tag: "",
                  boardId: board.id,
                });
              })
              .finally(stop);
          }
        })}
      >
        <Group position="apart" noWrap>
          <div className="flex items-center w-full gap-2">
            <ActionIcon
              variant="light"
              color={form.values.description ? "blue" : undefined}
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
              placeholder="Nouvelle tâche"
              onKeyDown={({ code }) => {
                if (code === "Enter") {
                  handleSubmit();
                }
              }}
              {...form.getInputProps("description")}
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

export default NewTaskCard;
