import { Button, Group, Stack, TextInput } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import useBooleanState from "hooks/useBooleanState";
import { FC, useMemo, useState } from "react";
import { TaskDocument } from "types/firebase/collections";
import { updateDoc } from "utils/firebase";
import { cleanString } from "utils/string";

export interface EditTaskModalProps {
  task: TaskDocument;
}

const EditTaskModal: FC<EditTaskModalProps> = ({ task }) => {
  const [loading, start, stop] = useBooleanState();
  const [value, setValue] = useState(task.name ?? "");

  const formattedValue = useMemo(() => {
    return cleanString(value);
  }, [value]);

  return (
    <Stack>
      <TextInput
        label="Tâche"
        placeholder="Trier sa boîte mail"
        disabled={loading}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
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
          <Button
            loading={loading}
            onClick={() => {
              if (task.ref && formattedValue) {
                start();
                updateDoc<TaskDocument>(task.ref, { name: formattedValue })
                  .then(() => {
                    closeAllModals();
                  })
                  .finally(stop);
              }
            }}
          >
            Modifier
          </Button>
        </Group>
      </div>
    </Stack>
  );
};

export default EditTaskModal;
