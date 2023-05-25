import { Button, Group, Input, Stack, TextInput } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { IconUpload } from "@tabler/icons-react";
import classNames from "classnames";
import { collection } from "firebase/firestore";
import { ref } from "firebase/storage";
import useBooleanState from "hooks/useBooleanState";
import { FC, useRef } from "react";
import { useUploadFile } from "react-firebase-hooks/storage";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import {
  Collection,
  DocumentDocument,
  DocumentMime,
} from "types/firebase/collections";
import { addDoc, storage } from "utils/firebase";
import { getExtension } from "utils/storage";
import { cleanString } from "utils/string";

const NewDocumentModalContent: FC = () => {
  const { board } = useBoard();
  const [loading, start, stop] = useBooleanState();
  const [uploadFile] = useUploadFile();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    initialValues: {
      name: "",
      file: undefined as FileWithPath | undefined,
    },

    validate: {
      name: (name) => {
        return name.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
      file: (file?: FileWithPath) => {
        return file ? null : "Ce champ ne doit pas être vide";
      },
    },

    transformValues: (values) => {
      return {
        name: cleanString(values.name),
        file: values.file,
        mime: values.file?.type as DocumentMime | undefined,
      };
    },
  });

  return (
    <form
      ref={formRef}
      onSubmit={form.onSubmit(async (values) => {
        const arrayBuffer = await values.file?.arrayBuffer();

        if (board?.id && board.ref && values.mime && arrayBuffer) {
          start();

          addDoc<DocumentDocument>(
            collection(board.ref, Collection.documents),
            {
              name: values.name,
              mime: values.mime,
            }
          )
            .then((document) => {
              return uploadFile(
                ref(
                  storage,
                  `boards/${board.id}/documents/${
                    document.id
                  }/document.${getExtension(values.file?.type as DocumentMime)}`
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
          data-autofocus
          autoFocus
          withAsterisk
          disabled={loading}
          label="Nom du document"
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
            accept={[DocumentMime.Jpeg, DocumentMime.Png, DocumentMime.Pdf]}
            classNames={{
              root: classNames("px-[12px] border-[1px]", {
                "border-red-400": form.errors.file,
              }),
            }}
          >
            <Group>
              <div
                className={classNames("text-sm", {
                  "text-[#adb5bd]": !form.values.file,
                })}
              >
                {form.values.file
                  ? form.values.file.name
                  : "Déposer le document ici"}
              </div>
              {!form.values.file && (
                <IconUpload className="ml-auto" size={18} />
              )}
            </Group>
          </Dropzone>
        </Input.Wrapper>
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

export default NewDocumentModalContent;
