import { Badge, Button, Group, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { updateDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { BoardDocument, DocumentDocument } from "types/firebase/collections";
import { getColorFromString } from "utils/color";

export interface EditDocumentModalProps {
  board: BoardDocument;
  document: DocumentDocument;
}

const EditDocumentModal: FC<EditDocumentModalProps> = ({ board, document }) => {
  const [loading, start, stop] = useBooleanState();

  const form = useForm({
    initialValues: {
      name: document.name ?? "",
      tag: document.tag ?? "",
    },

    validate: {
      name: (name) => {
        return name.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (document?.ref) {
          start();
          updateDoc<DocumentDocument>(document.ref, {
            name: values.name.trim(),
            tag: values.tag,
          })
            .then(() => closeAllModals())
            .finally(stop);
        }
      })}
    >
      <Stack>
        <TextInput
          data-autofocus
          disabled={loading}
          withAsterisk
          label="Type de document"
          placeholder="Passeport"
          {...form.getInputProps("name")}
        />
        <Select
          label="Étiquette"
          data={board?.tags ?? []}
          placeholder="John Doe"
          itemComponent={({ value, ...rest }) => {
            return (
              <div {...rest}>
                <Badge variant="dot" color={getColorFromString(value)}>
                  {value}
                </Badge>
              </div>
            );
          }}
          clearable
          styles={(theme) => ({
            item: {
              "&[data-selected]": {
                "&, &:hover": {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[9]
                      : theme.white,
                },
                "&:hover": {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[8]
                      : theme.colors.gray[1],
                },
              },
            },
          })}
          {...form.getInputProps("tag")}
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

export default EditDocumentModal;
