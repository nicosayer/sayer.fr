import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { addDoc, collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { BoardDocument, Collection } from "types/firebase/collections";

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
        return typeof name === "string" ? null : "Erreur";
      },
      url: (url) => {
        return typeof url === "string" ? null : "Erreur";
      },
      username: (username) => {
        return typeof username === "string" && username.length > 0
          ? null
          : "Erreur";
      },
      password: (password) => {
        return typeof password === "string" && password.length > 0
          ? null
          : "Erreur";
      },
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (board?.ref) {
          start();
          addDoc(collection(board.ref, Collection.credentials), {
            name: values.name,
            username: values.username,
            password: values.password,
            url: values.url,
          })
            .then(() => closeAllModals())
            .finally(stop);
        }
      })}
    >
      <Stack>
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
          label="Nom du site web"
          placeholder="Acme"
          {...form.getInputProps("name")}
        />
        <TextInput
          disabled={loading}
          label="Lien vers le site web"
          placeholder="https://acme.com"
          {...form.getInputProps("url")}
        />
        <div className="flex ml-auto">
          <Button type="submit" loading={loading}>
            Créer
          </Button>
        </div>
      </Stack>
    </form>
  );
};

export default NewCredentialModal;
