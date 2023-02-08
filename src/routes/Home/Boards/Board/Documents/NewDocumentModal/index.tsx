import { Button, Group, Input, Stack, TextInput } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { IconUpload } from "@tabler/icons";
import classNames from "classnames";
import TagsMultiSelect from "components/molecules/MultiSelect/Tags";
import { collection, doc } from "firebase/firestore";
import { ref } from "firebase/storage";
import useBooleanState from "hooks/useBooleanState";
import { FC, useRef } from "react";
import { useUploadFile } from "react-firebase-hooks/storage";
import {
  Collection,
  DocumentDocument,
  DocumentMime,
} from "types/firebase/collections";
import { addDoc, db, storage } from "utils/firebase";
import { getExtension } from "utils/storage";
import { useBoard } from "../../Provider";

const NewDocumentModal: FC = () => {
  const { board, tags } = useBoard();
  const [loading, start, stop] = useBooleanState();
  const [uploadFile] = useUploadFile();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    initialValues: {
      name: "",
      file: undefined as FileWithPath | undefined,
      tags: [] as string[],
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
        name: values.name.trim(),
        file: values.file,
        mime: values.file?.type as DocumentMime | undefined,
        tags: values.tags,
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
              tags: values.tags.map((tag) => {
                return doc(db, tag);
              }),
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
              Ajouter
            </Button>
          </Group>
        </div>
      </Stack>
    </form>
  );
};

export default NewDocumentModal;
