import { Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import CredentialFormInputs from "components/organisms/CredentialFormInputs";
import { collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import {
  BoardDocument,
  Collection,
  CredentialDocument,
} from "types/firebase/collections";
import { addDoc } from "utils/firebase";

export interface NewCredentialModalProps {
  board: BoardDocument;
}

const NewCredentialModal: FC<NewCredentialModalProps> = ({ board }) => {
  const [loading, start, stop] = useBooleanState();
  const form = useForm({
    initialValues: {
      name: "",
      url: "",
      username: "",
      password: "",
      tag: "",
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
        tag: values.tag || undefined,
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
              tag: values.tag,
            }
          )
            .then(() => closeAllModals())
            .finally(stop);
        }
      })}
    >
      <Stack>
        <CredentialFormInputs loading={loading} form={form} board={board} />
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
