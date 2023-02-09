import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import TagsMultiSelect from "components/molecules/MultiSelect/Tags";
import { doc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useMemo } from "react";
import { useBoards } from "routes/Home/Boards/Provider";
import { DocumentDocument } from "types/firebase/collections";
import { db, updateDoc } from "utils/firebase";
import { cleanString } from "utils/string";

export interface EditDocumentModalProps {
  document: DocumentDocument;
}

const EditDocumentModal: FC<EditDocumentModalProps> = ({ document }) => {
  const [loading, start, stop] = useBooleanState();
  const { tags: boardsTags } = useBoards();

  const tags = useMemo(() => {
    return boardsTags[String(document.ref?.parent.parent?.id)] ?? [];
  }, [boardsTags, document.ref?.parent.parent?.id]);

  const form = useForm({
    initialValues: {
      name: document.name ?? "",
      tags: (document.tags ?? []).map((tag) => tag.path),
    },

    validate: {
      name: (name) => {
        return name.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
    },

    transformValues: (values) => {
      return {
        name: cleanString(values.name),
        tags: values.tags,
      };
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (document?.ref) {
          start();
          updateDoc<DocumentDocument>(document.ref, {
            name: values.name,
            tags: values.tags.map((tag) => {
              return doc(db, tag);
            }),
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
        {tags?.length ? (
          <TagsMultiSelect
            label="Étiquette"
            placeholder="John Doe"
            tags={tags}
            loading={loading}
            {...form.getInputProps("tags")}
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
