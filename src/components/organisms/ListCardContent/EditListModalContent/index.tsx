import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import {  collection, deleteDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { sortBy } from "lodash";
import { FC } from "react";
import {
  Collection,
  ListDocument,
  ListItemDocument,
  ListItemStatus,
} from "types/firebase/collections";
import { runInParallel } from "utils/async";
import { addDoc, updateDoc } from "utils/firebase";
import { cleanString, sanitize } from "utils/string";

export interface EditListModalContentProps {
  list: ListDocument;
  listItems: ListItemDocument[];
}

const EditListModalContent: FC<EditListModalContentProps> = ({
  list,
  listItems,
}) => {
  const [loading, start, stop] = useBooleanState();

  const form = useForm({
    initialValues: {
      name: list.name ?? "",
      itemNames: sortBy(listItems, (listItem) =>
        sanitize(listItem.name ?? "")
      ).map((listItem) => listItem.name ?? ""),
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
      onSubmit={form.onSubmit((values) => {
        if (list?.ref && values.itemNames.length > 0) {
          start();
          updateDoc<ListDocument>(list.ref, {
            name: values.name,
          })
            .then(() => {
              return runInParallel(listItems, (listItem) => {
                if (listItem.ref) {
                  return deleteDoc(listItem.ref);
                }
              });
            })
            .then(() => {
              return runInParallel(values.itemNames, (itemName) => {
                if (list.ref) {
                  return addDoc<ListItemDocument>(
                    collection(list.ref, Collection.listItems),
                    {
                      name: itemName,
                      status: ListItemStatus.Empty,
                    }
                  );
                }
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
          disabled={loading}
          withAsterisk
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
              label={index === 0 ? 'Éléments' : ""}
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
              Modifier
            </Button>
          </Group>
        </div>
      </Stack>
    </form>
  );
};

export default EditListModalContent;
