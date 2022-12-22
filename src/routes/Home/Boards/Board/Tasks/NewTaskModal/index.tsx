import { Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import TaskFormInputs from "components/organisms/TaskFormInputs";
import dayjs from "dayjs";
import { addDoc, collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import {
  BoardDocument,
  Collection,
  TaskDocument,
} from "types/firebase/collections";

export interface NewTaskModalProps {
  boards: BoardDocument[];
}

const NewTaskModal: FC<NewTaskModalProps> = ({ boards }) => {
  const [loading, start, stop] = useBooleanState();

  const form = useForm({
    initialValues: {
      description: "",
      tag: "",
      boardId:
        boards.length === 1
          ? boards[0].id
          : localStorage.getItem("default-board-id") ?? undefined,
    },

    validate: {
      boardId: (boardId?: string) => {
        return boards.find((board) => board.id === boardId)
          ? null
          : "Ce champ ne doit pas être vide";
      },
      description: (description) => {
        return description.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        const board = boards.find((board) => board.id === values.boardId);

        if (board?.id && board.ref) {
          start();
          localStorage.setItem("default-board-id", board.id);
          addDoc<TaskDocument>(collection(board.ref, Collection.tasks), {
            description: values.description.trim(),
            order: +dayjs(),
            tag: values.tag,
          })
            .then(() => closeAllModals())
            .finally(stop);
        }
      })}
    >
      <Stack>
        <TaskFormInputs loading={loading} form={form} boards={boards} />
        <div className="flex ml-auto">
          <Group>
            <Button
              variant="default"
              disabled={loading}
              onClick={() => {
                closeAllModals();
              }}
            >
              Annuler
            </Button>
            <Button type="submit" loading={loading}>
              Ajouter
            </Button>
          </Group>
        </div>
      </Stack>
    </form>
  );
};

export default NewTaskModal;
