import { Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import CredentialFormInputs from "components/organisms/CredentialFormInputs";
import { deleteField } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { BoardDocument, CredentialDocument } from "types/firebase/collections";
import { updateDoc } from "utils/firebase";

export interface EditCredentialModalProps {
  credential: CredentialDocument;
  board: BoardDocument;
}

const EditCredentialModal: FC<EditCredentialModalProps> = ({
  credential,
  board,
}) => {
  const [loading, start, stop] = useBooleanState();

  const form = useForm({
    initialValues: {
      name: credential.name ?? "",
      url: credential.url ?? "",
      username: credential.username ?? "",
      password: credential.password ?? "",
      tag: credential.tag ?? "",
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
        url: values.url.trim() || deleteField(),
        tag: values.tag || deleteField(),
      };
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
            tag: values.tag,
          })
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
              Modifier
            </Button>
          </Group>
        </div>
      </Stack>
    </form>
  );
};

export default EditCredentialModal;
