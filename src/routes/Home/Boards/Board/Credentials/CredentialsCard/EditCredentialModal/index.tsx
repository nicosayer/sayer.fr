import { Button, Group, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { updateDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { CredentialDocument } from "types/firebase/collections";

export interface EditCredentialModalProps {
  credential: CredentialDocument;
}

const EditCredentialModal: FC<EditCredentialModalProps> = ({ credential }) => {
  const [loading, start, stop] = useBooleanState();

  const form = useForm({
    initialValues: {
      name: credential.name ?? "",
      url: credential.url ?? "",
      username: credential.username ?? "",
      password: credential.password ?? "",
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
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (credential?.ref) {
          start();
          updateDoc<CredentialDocument>(credential.ref, {
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

export default EditCredentialModal;
