import { PasswordInput, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { FC } from "react";

export interface CredentialForm {
  name: string;
  url: string;
  username: string;
  password: string;
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
        label="Identifiant"
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
    </>
  );
};

export default CredentialFormInputs;
