import { Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import CredentialFormInputs from "components/organisms/CredentialFormInputs";
import { collection, doc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { Collection, CredentialDocument } from "types/firebase/collections";
import { addDoc, db } from "utils/firebase";
import { useBoard } from "../../Provider";

const NewCredentialModal: FC = () => {
  const { board, tags } = useBoard();
  const [loading, start, stop] = useBooleanState();
  const form = useForm({
    initialValues: {
      name: "",
      url: "",
      username: "",
      password: "",
      tags: [] as string[],
    },

    validate: {
      name: (name) => {
        return name.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
      username: (username) => {
        return username.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
      password: (password) => {
        return password.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
    },

    transformValues: (values) => {
      return {
        name: values.name.trim(),
        username: values.username.trim(),
        password: values.password,
        url: values.url.trim() || undefined,
        tags: values.tags,
      };
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (board?.id && board.ref) {
          start();
          addDoc<CredentialDocument>(
            collection(board.ref, Collection.credentials),
            {
              name: values.name,
              username: values.username,
              password: values.password,
              url: values.url,
              tags: values.tags.map((tag) => {
                return doc(db, tag);
              }),
            }
          )
            .then(() => closeAllModals())
            .finally(stop);
        }
      })}
    >
      <Stack>
        <CredentialFormInputs loading={loading} form={form} tags={tags} />
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

export default NewCredentialModal;
