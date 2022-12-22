import { TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import BoardSelect from "components/molecules/Select/Board";
import TagSelect from "components/molecules/Select/Tag";
import { FC, useMemo } from "react";
import { BoardDocument } from "types/firebase/collections";

export interface TaskForm {
  description: string;
  boardId: string | undefined;
  tag: string;
}

export interface TaskFormInputsProps {
  loading: boolean;
  boards: BoardDocument[];
  form: UseFormReturnType<TaskForm, (values: TaskForm) => TaskForm>;
}

const TaskFormInputs: FC<TaskFormInputsProps> = ({ loading, form, boards }) => {
  const board = useMemo(() => {
    return boards.find((board) => board.id === form.values.boardId);
  }, [boards, form.values.boardId]);

  return (
    <>
      <TextInput
        data-autofocus
        withAsterisk
        disabled={loading}
        label="Description de la tache"
        placeholder="Payer la taxe d'habitation"
        {...form.getInputProps("description")}
      />
      {boards.length > 1 && (
        <BoardSelect
          label="Board"
          boards={boards}
          loading={loading}
          {...form.getInputProps("boardId")}
        />
      )}
      {board?.tags?.length ? (
        <TagSelect
          label="Étiquette"
          placeholder="John Doe"
          board={board}
          loading={loading}
          {...form.getInputProps("tag")}
        />
      ) : undefined}
    </>
  );
};

export default TaskFormInputs;
