import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { addDoc, collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import {
  BoardDocument,
  Collection,
  DocumentDocument,
} from "types/firebase/collections";

export interface NewDocumentModalProps {
  board: BoardDocument;
}

const NewDocumentModal: FC<NewDocumentModalProps> = ({ board }) => {
  const [loading, start, stop] = useBooleanState();

  const form = useForm({
    initialValues: {
      type: "",
      owner: "",
    },

    validate: {
      type: (type) => {
        return typeof type === "string" && type.length > 0
          ? null
          : "Ce champ ne doit pas être vide";
      },
      owner: (owner) => {
        return typeof owner === "string" && owner.length > 0
          ? null
          : "Ce champ ne doit pas être vide";
      },
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (board?.ref) {
          start();
          addDoc<DocumentDocument>(
            collection(board.ref, Collection.documents),
            {
              type: values.type,
              owner: values.owner,
            }
          )
            .then(() => closeAllModals())
            .finally(stop);
        }
      })}
    >
      <Stack>
        <TextInput
          withAsterisk
          disabled={loading}
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
              loading={loading}
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

export default NewDocumentModal;
