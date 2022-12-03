import { Button, Group, Input, Stack, TextInput } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { storage } from "configs/firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref } from "firebase/storage";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { useUploadFile } from "react-firebase-hooks/storage";
import {
  BoardDocument,
  Collection,
  DocumentDocument,
} from "types/firebase/collections";
import { getExtension } from "utils/storage";

export interface NewDocumentModalProps {
  board: BoardDocument;
}

const NewDocumentModal: FC<NewDocumentModalProps> = ({ board }) => {
  const [loading, start, stop] = useBooleanState();
  const [uploadFile] = useUploadFile();

  const form = useForm({
    initialValues: {
      type: "",
      owner: "",
      file: undefined as FileWithPath | undefined,
    },

    validate: {
      type: (type) => {
        return type.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
      owner: (owner) => {
        return owner.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
      file: (file?: FileWithPath) => {
        return file ? null : "Ce champ ne doit pas être vide";
      },
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        if (board?.ref && values.file?.type) {
          start();

          const arrayBuffer = await values.file?.arrayBuffer();

          addDoc<DocumentDocument>(
            collection(board.ref, Collection.documents),
            {
              type: values.type,
              owner: values.owner,
              mime: values.file.type,
            }
          )
            .then((document) => {
              return uploadFile(
                ref(
                  storage,
                  `boards/${board.id}/documents/${
                    document.id
                  }/document.${getExtension(String(values.file?.type))}`
                ),
                arrayBuffer,
                {
                  contentType: values.file?.type,
                }
              );
            })
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
        <Input.Wrapper
          label="Document"
          withAsterisk
          error={form.getInputProps("file").error}
        >
          <Dropzone
            maxFiles={1}
            maxSize={10 * 1024 ** 2} // 10MB
            onDrop={([file]) => {
              form.getInputProps("file").onChange(file);
            }}
            accept={["image/png", "image/jpeg", "application/pdf"]}
          >
            {form.getInputProps("file").value
              ? form.getInputProps("file").value.name
              : "Déposer le document ici"}
          </Dropzone>
        </Input.Wrapper>
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
