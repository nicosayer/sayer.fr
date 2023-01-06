import { PasswordInput, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import TagSelect from "components/molecules/Select/Tag";
import { FC } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";

export interface CredentialForm {
  name: string;
  url: string;
  username: string;
  password: string;
  tag: string;
}

export interface CredentialFormInputsProps {
  loading: boolean;
  form: UseFormReturnType<
    CredentialForm,
    (values: CredentialForm) => CredentialForm
  >;
}

const CredentialFormInputs: FC<CredentialFormInputsProps> = ({
  loading,
  form,
}) => {
  const { board } = useBoard();

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
      {board?.tags?.length ? (
        <TagSelect
          label="Étiquette"
          placeholder="John Doe"
          board={board}
          loading={loading}
          {...form.getInputProps("tag")}
        />
      ) : undefined}
    </>
  );
};

export default CredentialFormInputs;
