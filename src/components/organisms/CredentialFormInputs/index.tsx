import { PasswordInput, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { FC } from "react";

export interface CredentialFormInputsProps {
  loading: boolean;
  form: UseFormReturnType<
    {
      name: string;
      url: string;
      username: string;
      password: string;
    },
    (values: {
      name: string;
      url: string;
      username: string;
      password: string;
    }) => {
      name: string;
      url: string;
      username: string;
      password: string;
    }
  >;
}

const CredentialFormInputs: FC<CredentialFormInputsProps> = ({
  loading,
  form,
}) => {
  return (
    <>
      <TextInput
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
    </>
  );
};

export default CredentialFormInputs;
