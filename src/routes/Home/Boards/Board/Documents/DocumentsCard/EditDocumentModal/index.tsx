import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { updateDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { DocumentDocument } from "types/firebase/collections";

export interface EditDocumentModalProps {
  document: DocumentDocument;
}

const EditDocumentModal: FC<EditDocumentModalProps> = ({ document }) => {
  const [loading, start, stop] = useBooleanState();

  const form = useForm({
    initialValues: {
      type: document.type ?? "",
      owner: document.owner ?? "",
    },

    validate: {
      type: (type) => {
        return type.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
      owner: (owner) => {
        return owner.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (document?.ref) {
          start();
          updateDoc<DocumentDocument>(document.ref, {
            type: values.type,
            owner: values.owner,
          })
            .then(() => closeAllModals())
            .finally(stop);
        }
      })}
    >
      <Stack>
        <TextInput
          disabled={loading}
          withAsterisk
          label="Type de document"
          placeholder="Passeport"
          {...form.getInputProps("type")}
        />
        <TextInput
          disabled={loading}
          withAsterisk
          label="Nom du propriétaire"
          placeholder="John Doe"
          {...form.getInputProps("owner")}
        />
        <div className="flex ml-auto">
          <Group>
            <Button
              variant="outline"
              color="dark"
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
