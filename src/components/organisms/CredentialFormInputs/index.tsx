import { PasswordInput, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import TagsMultiSelect from "components/molecules/MultiSelect/Tags";
import { FC } from "react";
import { TagDocument } from "types/firebase/collections";

export interface CredentialForm {
  name: string;
  url: string;
  username: string;
  password: string;
  tags: string[];
}

export interface CredentialFormInputsProps {
  loading: boolean;
  tags: TagDocument[];
  form: UseFormReturnType<
    CredentialForm,
    (values: CredentialForm) => CredentialForm
  >;
}

const CredentialFormInputs: FC<CredentialFormInputsProps> = ({
  loading,
  tags,
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
      {tags?.length ? (
        <TagsMultiSelect
          label="Étiquette"
          placeholder="John Doe"
          tags={tags}
          loading={loading}
          {...form.getInputProps("tags")}
        />
      ) : undefined}
    </>
  );
};

export default CredentialFormInputs;
