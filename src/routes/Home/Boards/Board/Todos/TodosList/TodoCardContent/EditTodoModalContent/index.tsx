import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { TodoDocument } from "types/firebase/collections";
import { updateDoc } from "utils/firebase";
import { cleanString } from "utils/string";

export interface EditTodoModalContentProps {
  todo: TodoDocument;
}

const EditTodoModalContent: FC<EditTodoModalContentProps> = ({ todo }) => {
  const [loading, start, stop] = useBooleanState();

  const form = useForm({
    initialValues: {
      name: todo.name ?? "",
      description: todo.description ?? "",
    },

    validate: {
      name: (name) => {
        return name.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
    },

    transformValues: (values) => {
      return {
        name: cleanString(values.name),
        description: cleanString(values.description),
      };
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (todo?.ref) {
          start();
          updateDoc<TodoDocument>(todo.ref, {
            name: values.name,
            description: values.description,
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
          label="Todo"
          placeholder="Ranger la chambre"
          {...form.getInputProps("name")}
        />
        <TextInput
          data-autofocus
          autoFocus
          disabled={loading}
          label="Description"
          placeholder="Faire le lit"
          {...form.getInputProps("description")}
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

export default EditTodoModalContent;
