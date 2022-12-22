import { Button, Group, Input, Stack, TextInput } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { IconUpload } from "@tabler/icons";
import classNames from "classnames";
import BoardSelect from "components/molecules/Select/Board";
import TagSelect from "components/molecules/Select/Tag";
import { addDoc, collection } from "firebase/firestore";
import { ref } from "firebase/storage";
import useBooleanState from "hooks/useBooleanState";
import { FC, useMemo, useRef } from "react";
import { useUploadFile } from "react-firebase-hooks/storage";
import {
  BoardDocument,
  Collection,
  DocumentDocument,
  Mime,
} from "types/firebase/collections";
import { storage } from "utils/firebase";
import { getExtension } from "utils/storage";

export interface NewDocumentModalProps {
  boards: BoardDocument[];
}

const NewDocumentModal: FC<NewDocumentModalProps> = ({ boards }) => {
  const [loading, start, stop] = useBooleanState();
  const [uploadFile] = useUploadFile();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    initialValues: {
      name: "",
      file: undefined as FileWithPath | undefined,
      tag: "",
      boardId:
        boards.length === 1
          ? boards[0].id
          : localStorage.getItem("default-board-id") ?? undefined,
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
      file: (file?: FileWithPath) => {
        return file ? null : "Ce champ ne doit pas être vide";
      },
    },
  });

  const board = useMemo(() => {
    return boards.find((board) => board.id === form.values.boardId);
  }, [boards, form.values.boardId]);

  return (
    <form
      ref={formRef}
      onSubmit={form.onSubmit(async (values) => {
        const board = boards.find((board) => board.id === values.boardId);

        if (board?.id && board.ref && values.file?.type) {
          start();
          localStorage.setItem("default-board-id", board.id);

          const arrayBuffer = await values.file?.arrayBuffer();

          addDoc<DocumentDocument>(
            collection(board.ref, Collection.documents),
            {
              name: values.name.trim(),
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
            accept={[Mime.Jpeg, Mime.Png, Mime.Pdf]}
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
        {boards.length > 1 && (
          <BoardSelect
            label="Board"
            boards={boards}
            loading={loading}
            {...form.getInputProps("boardId")}
          />
        )}
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
              Ajouter
            </Button>
          </Group>
        </div>
      </Stack>
    </form>
  );
};

export default NewDocumentModal;
