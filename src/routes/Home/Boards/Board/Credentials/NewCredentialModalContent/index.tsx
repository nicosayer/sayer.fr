import { Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import CredentialFormInputs from "components/organisms/CredentialFormInputs";
import { collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { useEncrypt } from "hooks/useCrypto";
import { FC } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { Collection, CredentialDocument } from "types/firebase/collections";
import { addDoc } from "utils/firebase";
import { cleanString } from "utils/string";

const NewCredentialModalContent: FC = () => {
  const { board } = useBoard();
  const [loading, start, stop] = useBooleanState();
  const { encrypt } = useEncrypt();

  const form = useForm({
    initialValues: {
      name: "",
      url: "",
      username: "",
      password: "",
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
        url: values.url.trim() || undefined,
      };
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        if (board?.id && board.ref) {
          start();

          const password = await encrypt(values.password);

          addDoc<CredentialDocument>(
            collection(board.ref, Collection.credentials),
            {
              name: values.name,
              username: values.username,
              password: password?.data,
              url: values.url,
            }
          )
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
              Ajouter
            </Button>
          </Group>
        </div>
      </Stack>
    </form>
  );
};

export default NewCredentialModalContent;
