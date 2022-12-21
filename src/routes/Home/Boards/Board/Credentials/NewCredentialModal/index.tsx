import { Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import CredentialFormInputs from "components/organisms/CredentialFormInputs";
import { addDoc, collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import {
  BoardDocument,
  Collection,
  CredentialDocument,
} from "types/firebase/collections";

export interface NewCredentialModalProps {
  boards: BoardDocument[];
}

const NewCredentialModal: FC<NewCredentialModalProps> = ({ boards }) => {
  const [loading, start, stop] = useBooleanState();

  const form = useForm({
    initialValues: {
      name: "",
      url: "",
      username: "",
      password: "",
      tag: "",
      boardId: boards.length === 1 ? boards[0].id : undefined,
    },

    validate: {
      boardId: (boardId?: string) => {
        return boards.find((board) => board.id === boardId)
          ? null
          : "Ce champ ne doit pas être vide";
      },
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
        const board = boards.find((board) => board.id === values.boardId);

        if (board?.ref) {
          start();
          addDoc<CredentialDocument>(
            collection(board.ref, Collection.credentials),
            {
              name: values.name.trim(),
              username: values.username.trim(),
              password: values.password,
              url: values.url.trim(),
              tag: values.tag,
            }
          )
            .then(() => closeAllModals())
            .finally(stop);
        }
      })}
    >
      <Stack>
        <CredentialFormInputs loading={loading} form={form} boards={boards} />
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
