import { PasswordInput, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import BoardSelect from "components/molecules/Select/Board";
import TagSelect from "components/molecules/Select/Tag";
import { FC, useMemo } from "react";
import { BoardDocument } from "types/firebase/collections";

export interface CredentialForm {
  name: string;
  url: string;
  username: string;
  password: string;
  boardId: string | undefined,
  tag: string;
}

export interface CredentialFormInputsProps {
  loading: boolean;
  boards: BoardDocument[];
  form: UseFormReturnType<
    CredentialForm,
    (values: CredentialForm) => CredentialForm
  >;
}

const CredentialFormInputs: FC<CredentialFormInputsProps> = ({
  loading,
  form,
  boards,
}) => {
  const board = useMemo(() => {
    return boards.find(board => board.id === form.values.boardId)
  }, [boards, form.values.boardId])

  return (
    <>
      <TextInput
        data-autofocus
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
        placeholder="john.doe@acme.com"
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
      {boards.length > 1 && <BoardSelect
        boards={boards}
        loading={loading}
        {...form.getInputProps("boardId")}
      />}
      {board?.tags?.length ? <TagSelect
        board={board}
        loading={loading}
        {...form.getInputProps("tag")}
      /> : undefined}
    </>
  );
};

export default CredentialFormInputs;
