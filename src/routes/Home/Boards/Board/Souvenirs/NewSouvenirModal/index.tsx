import {
  Button,
  Group,
  Input,
  Modal,
  ModalProps,
  Stack,
  Textarea,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import TagSelect from "components/molecules/Select/Tag";
import dayjs from "dayjs";
import { collection, deleteField } from "firebase/firestore";
import { ref } from "firebase/storage";
import useBooleanState from "hooks/useBooleanState";
import { FC, useRef } from "react";
import { useUploadFile } from "react-firebase-hooks/storage";
import {
  BoardDocument,
  Collection,
  SouvenirDocument,
  SouvenirPictureDocument,
  SouvenirPictureMime,
} from "types/firebase/collections";
import { runInSeries } from "utils/async";
import { addDoc, storage } from "utils/firebase";
import { getExtension } from "utils/storage";

export interface NewSouvenirModalContentProps {
  board: BoardDocument;
  files: File[];
  onClose: () => void;
  defaultDate?: Date;
}

const NewSouvenirModalContent: FC<NewSouvenirModalContentProps> = ({
  board,
  files,
  onClose,
  defaultDate = new Date(),
}) => {
  const [loading, start, stop] = useBooleanState();
  const [uploadFile] = useUploadFile();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    initialValues: {
      description: "",
      date: defaultDate,
      tag: "",
    },

    validate: {
      description: (description) => {
        return description.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
    },

    transformValues: (values) => {
      return {
        description: values.description.trim(),
        date: dayjs(values.date).format("YYYY-MM-DD"),
        tag: values.tag || deleteField(),
      };
    },
  });

  return (
    <form
      ref={formRef}
      onSubmit={form.onSubmit(async (values) => {
        if (board.ref) {
          start();

          addDoc<SouvenirDocument>(
            collection(board.ref, Collection.souvenirs),
            {
              description: values.description,
              date: values.date,
              tag: values.tag,
            }
          )
            .then((souvenir) => {
              return runInSeries(files, async (file) => {
                if (board.ref) {
                  addDoc<SouvenirPictureDocument>(
                    collection(
                      board.ref,
                      Collection.souvenirs,
                      souvenir.id,
                      Collection.souvenirPictures
                    ),
                    {
                      mime: file.type as SouvenirPictureMime,
                    }
                  ).then(async (souvenirPicture) => {
                    const arrayBuffer = await file?.arrayBuffer();

                    return uploadFile(
                      ref(
                        storage,
                        `${Collection.boards}/${board.id}/${Collection.souvenirs
                        }/${souvenir.id}/${Collection.souvenirPictures}/${souvenirPicture.id
                        }/document.${getExtension(
                          file?.type as SouvenirPictureMime
                        )}`
                      ),
                      arrayBuffer,
                      {
                        contentType: file?.type,
                      }
                    );
                  });
                }
              });
            })
            .then(onClose)
            .finally(stop);
        }
      })}
    >
      <Stack>
        <Input.Wrapper label={files.length > 1 ? "Photos" : "Photo"}>
          <div className="text-center">
            {files.map((file, index) => {
              return (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`Souvenir ${index + 1}`}
                  className="w-[100px] h-[100px] object-cover m-1 border border-solid border-gray-400 rounded-md"
                />
              );
            })}
          </div>
        </Input.Wrapper>
        <Textarea
          data-autofocus
          withAsterisk
          disabled={loading}
          label="Description"
          {...form.getInputProps("description")}
        />
        <DatePicker
          locale="fr"
          inputFormat="D MMMM YYYY"
          withAsterisk
          disabled={loading}
          label="Date"
          clearable={false}
          {...form.getInputProps("date")}
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
            <Button variant="default" disabled={loading} onClick={onClose}>
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

export interface NewSouvenirModalProps extends Omit<ModalProps, "opened"> {
  board: BoardDocument;
  files?: File[];
  defaultDate?: Date;
}

const NewSouvenirModal: FC<NewSouvenirModalProps> = ({
  board,
  files,
  onClose,
  defaultDate,
  ...rest
}) => {
  return (
    <Modal
      title="Nouveau souvenir"
      opened={Boolean(files)}
      onClose={onClose}
      centered
      {...rest}
    >
      {files?.length && (
        <NewSouvenirModalContent
          board={board}
          files={files}
          onClose={onClose}
          defaultDate={defaultDate}
        />
      )}
    </Modal>
  );
};

export default NewSouvenirModal;
