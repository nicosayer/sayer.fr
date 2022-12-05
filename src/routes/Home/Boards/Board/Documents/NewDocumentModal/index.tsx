import {
  Badge,
  Button,
  Group,
  Input,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { storage } from "configs/firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref } from "firebase/storage";
import useBooleanState from "hooks/useBooleanState";
import { FC, useRef } from "react";
import { useUploadFile } from "react-firebase-hooks/storage";
import {
  BoardDocument,
  Collection,
  DocumentDocument,
  Mime,
} from "types/firebase/collections";
import { getExtension } from "utils/storage";

export interface NewDocumentModalProps {
  board: BoardDocument;
}

const NewDocumentModal: FC<NewDocumentModalProps> = ({ board }) => {
  const [loading, start, stop] = useBooleanState();
  const [uploadFile] = useUploadFile();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    initialValues: {
      name: "",
      file: undefined as FileWithPath | undefined,
      tag: "",
    },

    validate: {
      name: (name) => {
        return name.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
      file: (file?: FileWithPath) => {
        return file ? null : "Ce champ ne doit pas être vide";
      },
    },
  });

  return (
    <form
      ref={formRef}
      onSubmit={form.onSubmit(async (values) => {
        if (board?.ref && values.file?.type) {
          start();

          const arrayBuffer = await values.file?.arrayBuffer();

          addDoc<DocumentDocument>(
            collection(board.ref, Collection.documents),
            {
              name: values.name,
              tag: values.tag,
              mime: values.file.type as Mime,
            }
          )
            .then((document) => {
              return uploadFile(
                ref(
                  storage,
                  `boards/${board.id}/documents/${
                    document.id
                  }/document.${getExtension(values.file?.type as Mime)}`
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
          {...form.getInputProps("name")}
        />
        <Input.Wrapper label="Document" withAsterisk error={form.errors.file}>
          <Dropzone
            maxFiles={1}
            maxSize={10 * 1024 ** 2} // 10MB
            onDrop={([file]) => {
              form.getInputProps("file").onChange(file);
            }}
            accept={[Mime.Jpeg, Mime.Png, Mime.Pdf]}
          >
            {form.values.file
              ? form.values.file.name
              : "Déposer le document ici"}
          </Dropzone>
        </Input.Wrapper>
        <Select
          label="Étiquette"
          data={board?.tags ?? []}
          placeholder="John Doe"
          itemComponent={({ value, ...rest }) => {
            return (
              <div {...rest}>
                <Badge variant="dot" color="red">
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
              Ajouter
            </Button>
          </Group>
        </div>
      </Stack>
    </form>
  );
};

export default NewDocumentModal;
