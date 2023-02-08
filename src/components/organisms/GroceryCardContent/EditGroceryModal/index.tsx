import { Button, Group, Stack, TextInput } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import useBooleanState from "hooks/useBooleanState";
import { FC, useMemo, useState } from "react";
import { GroceryDocument } from "types/firebase/collections";
import { updateDoc } from "utils/firebase";
import { cleanString } from "utils/string";

export interface EditGroceryModalProps {
  grocery: GroceryDocument;
}

const EditGroceryModal: FC<EditGroceryModalProps> = ({ grocery }) => {
  const [loading, start, stop] = useBooleanState();
  const [value, setValue] = useState(grocery.name ?? "");

  const formattedValue = useMemo(() => {
    return cleanString(value);
  }, [value]);

  return (
    <Stack>
      <TextInput
        label="Course"
        placeholder="Avocats"
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
              if (grocery.ref && formattedValue) {
                start();
                updateDoc<GroceryDocument>(grocery.ref, {
                  name: formattedValue,
                })
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

export default EditGroceryModal;
