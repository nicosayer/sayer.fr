import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { TaskDocument } from "types/firebase/collections";
import { updateDoc } from "utils/firebase";
import { cleanString } from "utils/string";

export interface EditTaskModalProps {
  task: TaskDocument;
}

const EditTaskModal: FC<EditTaskModalProps> = ({ task }) => {
  const [loading, start, stop] = useBooleanState();

  const form = useForm({
    initialValues: {
      name: task.name ?? "",
    },

    validate: {
      name: (name) => {
        return name.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
    },

    transformValues: (values) => {
      return {
        name: cleanString(values.name),
      };
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (task?.ref) {
          start();
          updateDoc<TaskDocument>(task.ref, {
            name: values.name,
          })
            .then(() => closeAllModals())
            .finally(stop);
        }
      })}
    >
      <Stack>
        <TextInput
          data-autofocus
          autoFocus
          disabled={loading}
          withAsterisk
          label="Course"
          placeholder="Avocats"
          {...form.getInputProps("name")}
        />
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
              Modifier
            </Button>
          </Group>
        </div>
      </Stack>
    </form>
  );
};

export default EditTaskModal;
