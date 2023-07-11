import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useRef } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import {
  Collection,
  ListDocument,
  ListItemDocument,
  ListItemStatus,
} from "types/firebase/collections";
import { runInParallel } from "utils/async";
import { addDoc } from "utils/firebase";
import { cleanString } from "utils/string";

const NewListModalContent: FC = () => {
  const { board } = useBoard();
  const [loading, start, stop] = useBooleanState();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    initialValues: {
      name: "",
      itemNames: [],
    },

    validate: {
      name: (name) => {
        return name.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
    },

    transformValues: (values) => {
      return {
        name: cleanString(values.name),
        itemNames: values.itemNames.map(cleanString).filter(Boolean),
      };
    },
  });

  return (
    <form
      ref={formRef}
      onSubmit={form.onSubmit(async (values) => {
        if (board?.id && board.ref && values.itemNames.length > 0) {
          start();

          addDoc<ListDocument>(collection(board.ref, Collection.lists), {
            name: values.name,
          })
            .then((list) => {
              return runInParallel(values.itemNames, (itemName, index) => {
                return addDoc<ListItemDocument>(
                  collection(list, Collection.listItems),
                  {
                    name: itemName,
                    status: ListItemStatus.Empty,
                  }
                );
              });
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
          label="Nom de la liste"
          placeholder="Sac de vacances"
          {...form.getInputProps("name")}
        />
        {Array(form.values.itemNames.length + 1)
          .fill(null)
          .map((_, index) => (
            <TextInput
              key={index}
              withAsterisk={index === 0}
              disabled={loading}
              label={`Élément ${index + 1}`}
              placeholder={
                [
                  "Maillot de bain",
                  "Crème solaire",
                  "Lunettes de soleil",
                  "Tongues",
                  "Serviette de plage",
                  "Chapeau",
                  "Livre",
                  "Trousse de toilette",
                  "Chargeur",
                  "Appareil photo",
                ][index % 10]
              }
              {...form.getInputProps(`itemNames.${index}`)}
            />
          ))}
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

export default NewListModalContent;
