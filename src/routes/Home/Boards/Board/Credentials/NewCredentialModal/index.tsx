import { Button, Group, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { addDoc, collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import {
  BoardDocument,
  Collection,
  CredentialDocument,
} from "types/firebase/collections";

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
    },

    validate: {
      name: (name) => {
        return typeof name === "string" && name.length > 0
          ? null
          : "Ce champ ne doit pas être vide";
      },
      url: (url) => {
        return typeof url === "string"
          ? null
          : "Ce champ ne doit pas être vide";
      },
      username: (username) => {
        return typeof username === "string" && username.length > 0
          ? null
          : "Ce champ ne doit pas être vide";
      },
      password: (password) => {
        return typeof password === "string" && password.length > 0
          ? null
          : "Ce champ ne doit pas être vide";
      },
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (board?.ref) {
          start();
          addDoc<CredentialDocument>(
            collection(board.ref, Collection.credentials),
            {
              name: values.name,
              username: values.username,
              password: values.password,
              url: values.url,
            }
          )
            .then(() => closeAllModals())
            .finally(stop);
        }
      })}
    >
      <Stack>
        <TextInput
          withAsterisk
          disabled={loading}
          label="Nom du site web"
          placeholder="Acme"
          {...form.getInputProps("name")}
        />
        <TextInput
          disabled={loading}
          withAsterisk
          label="Nom d'utilisateur"
          placeholder="admin@acme.com"
          {...form.getInputProps("username")}
        />
        <PasswordInput
          disabled={loading}
          withAsterisk
          label="Mot de passe"
          placeholder="••••••••••"
          {...form.getInputProps("password")}
        />
        <TextInput
          disabled={loading}
          label="Lien vers le site web"
          placeholder="https://acme.com"
          {...form.getInputProps("url")}
        />
        <div className="flex ml-auto">
          <Group>
            <Button
              variant="outline"
              color="dark"
              loading={loading}
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
