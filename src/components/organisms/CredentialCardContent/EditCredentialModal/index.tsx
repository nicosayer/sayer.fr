import { Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import CredentialFormInputs from "components/organisms/CredentialFormInputs";
import { deleteField } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { useDecrypt, useEncrypt } from "hooks/useCrypto";
import { FC } from "react";
import { CredentialDocument } from "types/firebase/collections";
import { updateDoc } from "utils/firebase";
import { cleanString } from "utils/string";

export interface EditCredentialModalProps {
  credential: CredentialDocument;
}

const EditCredentialModalContent: FC<EditCredentialModalProps> = ({
  credential,
}) => {
  const [loading, start, stop] = useBooleanState();
  const { encrypt } = useEncrypt();

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

    transformValues: (values) => {
      return {
        name: cleanString(values.name),
        username: values.username.trim(),
        password: values.password,
        url: values.url.trim() || deleteField(),
      };
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        if (credential?.ref) {
          start();

          const password = await encrypt(values.password);

          updateDoc<CredentialDocument>(credential.ref, {
            name: values.name,
            username: values.username,
            password: password?.data,
            url: values.url,
          })
            .then(() => closeAllModals())
            .finally(stop);
        }
      })}
    >
      <Stack>
        <CredentialFormInputs loading={loading} form={form} />
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

const EditCredentialModal: FC<EditCredentialModalProps> = ({ credential }) => {
  const { value: password, loading } = useDecrypt(credential.password);

  if (loading) {
    return (
      <Stack>
        <div className="relative h-[100px]">
          <LoadingOverlay visible />
        </div>
        <div className="flex ml-auto">
          <Group>
            <Button
              variant="default"
              onClick={() => {
                closeAllModals();
              }}
            >
              Annuler
            </Button>
            <Button disabled>Modifier</Button>
          </Group>
        </div>
      </Stack>
    );
  }

  return (
    <EditCredentialModalContent credential={{ ...credential, password }} />
  );
};

export default EditCredentialModal;
