import { Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import CredentialFormInputs from "components/organisms/CredentialFormInputs";
import { updateDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useMemo } from "react";
import { BoardDocument, CredentialDocument } from "types/firebase/collections";

export interface EditCredentialModalProps {
  boards: BoardDocument[];
  credential: CredentialDocument;
}

const EditCredentialModal: FC<EditCredentialModalProps> = ({
  boards,
  credential,
}) => {
  const [loading, start, stop] = useBooleanState();

  const board = useMemo(() => {
    return boards.find(board => board.id === credential.ref?.parent.parent?.id)
  }, [boards, credential.ref?.parent.parent?.id])

  const form = useForm({
    initialValues: {
      name: credential.name ?? "",
      url: credential.url ?? "",
      username: credential.username ?? "",
      password: credential.password ?? "",
      tag: credential.tag ?? "",
      boardId: board?.id,
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
            name: values.name.trim(),
            username: values.username.trim(),
            password: values.password,
            url: values.url.trim(),
            tag: values.tag.trim(),
          })
            .then(() => closeAllModals())
            .finally(stop);
        }
      })}
    >
      <Stack>
        <CredentialFormInputs loading={loading} form={form} boards={board ? [board] : []} />
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
