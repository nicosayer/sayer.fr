import { Carousel, Embla, useAnimationOffsetEffect } from "@mantine/carousel";
import {
  Button,
  Group,
  Image,
  Modal,
  ModalProps,
  Stack,
  Textarea,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { collection } from "firebase/firestore";
import { ref } from "firebase/storage";
import useBooleanState from "hooks/useBooleanState";
import { FC, useRef, useState } from "react";
import { useUploadFile } from "react-firebase-hooks/storage";
import {
  Collection,
  SouvenirDocument,
  SouvenirPictureDocument,
  SouvenirPictureMime,
} from "types/firebase/collections";
import { runInSeries } from "utils/async";
import { formatDate } from "utils/dayjs";
import { addDoc, storage } from "utils/firebase";
import { getExtension } from "utils/storage";
import { cleanString } from "utils/string";
import { TRANSITION_DURATION } from "..";
import { useBoard } from "../../Provider";

export interface NewSouvenirModalContentProps {
  files: File[];
  onClose: () => void;
  defaultDate?: Date;
}

const NewSouvenirModalContent: FC<NewSouvenirModalContentProps> = ({
  files,
  onClose,
  defaultDate = new Date(),
}) => {
  const { board } = useBoard();
  const [loading, start, stop] = useBooleanState();
  const [uploadFile] = useUploadFile();
  const formRef = useRef<HTMLFormElement>(null);
  const [embla, setEmbla] = useState<Embla | null>(null);
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

  const form = useForm({
    initialValues: {
      description: "",
      date: defaultDate,
    },

    validate: {
      description: (description) => {
        return description.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
    },

    transformValues: (values) => {
      return {
        description: cleanString(values.description),
        date: formatDate(values.date),
      };
    },
  });

  return (
    <form
      ref={formRef}
      onSubmit={form.onSubmit(async (values) => {
        if (board?.ref) {
          start();

          addDoc<SouvenirDocument>(
            collection(board.ref, Collection.souvenirs),
            {
              description: values.description,
              date: values.date,
            }
          )
            .then(async (souvenir) => {
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
                        `${Collection.boards}/${board.id}/${
                          Collection.souvenirs
                        }/${souvenir.id}/${Collection.souvenirPictures}/${
                          souvenirPicture.id
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
        {files.length > 1 ? (
          <Carousel
            withIndicators
            loop
            getEmblaApi={setEmbla}
            className="overflow-hidden border border-gray-300 border-solid rounded-md"
          >
            {files.map((file, index) => (
              <Carousel.Slide key={index}>
                <Image src={URL.createObjectURL(file)} height={200} />
              </Carousel.Slide>
            ))}
          </Carousel>
        ) : (
          <Image src={URL.createObjectURL(files[0])} height={200} />
        )}
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
  files?: File[];
  defaultDate?: Date;
}

const NewSouvenirModal: FC<NewSouvenirModalProps> = ({
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
          files={files}
          onClose={onClose}
          defaultDate={defaultDate}
        />
      )}
    </Modal>
  );
};

export default NewSouvenirModal;
