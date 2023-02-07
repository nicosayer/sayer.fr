import { Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import CredentialFormInputs from "components/organisms/CredentialFormInputs";
import { deleteField, doc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useMemo } from "react";
import { useBoards } from "routes/Home/Boards/Provider";
import { CredentialDocument } from "types/firebase/collections";
import { db, updateDoc } from "utils/firebase";

export interface EditCredentialModalProps {
  credential: CredentialDocument;
}

const EditCredentialModal: FC<EditCredentialModalProps> = ({ credential }) => {
  const [loading, start, stop] = useBooleanState();
  const { boardTags } = useBoards();

  const tags = useMemo(() => {
    return boardTags[String(credential.ref?.parent.parent?.id)] ?? [];
  }, [boardTags, credential.ref?.parent.parent?.id]);

  const form = useForm({
    initialValues: {
      name: credential.name ?? "",
      url: credential.url ?? "",
      username: credential.username ?? "",
      password: credential.password ?? "",
      tags: (credential.tags ?? []).map((tag) => tag.path),
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
        tags: values.tags,
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
            tags: values.tags.map((tag) => {
              return doc(db, tag);
            }),
          })
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
              Modifier
            </Button>
          </Group>
        </div>
      </Stack>
    </form>
  );
};

export default EditCredentialModal;
