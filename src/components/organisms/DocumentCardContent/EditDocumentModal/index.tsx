import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import TagSelect from "components/molecules/Select/Tag";
import { updateDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useMemo } from "react";
import { BoardDocument, DocumentDocument } from "types/firebase/collections";

export interface EditDocumentModalProps {
  boards: BoardDocument[];
  document: DocumentDocument;
}

const EditDocumentModal: FC<EditDocumentModalProps> = ({
  boards,
  document,
}) => {
  const [loading, start, stop] = useBooleanState();

  const board = useMemo(() => {
    return boards.find((board) => board.id === document.ref?.parent.parent?.id);
  }, [boards, document.ref?.parent.parent?.id]);

  const form = useForm({
    initialValues: {
      name: document.name ?? "",
      tag: document.tag ?? "",
      boardId: board?.id,
    },

    validate: {
      boardId: (boardId?: string) => {
        return boards.find((board) => board.id === boardId)
          ? null
          : "Ce champ ne doit pas être vide";
      },
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
        {board?.tags?.length ? (
          <TagSelect
            label="Étiquette"
            placeholder="John Doe"
            board={board}
            loading={loading}
            {...form.getInputProps("tag")}
          />
        ) : undefined}
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
