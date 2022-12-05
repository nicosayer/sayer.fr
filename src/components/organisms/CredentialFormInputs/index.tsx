import { Badge, PasswordInput, Select, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { FC } from "react";
import { BoardDocument } from "types/firebase/collections";

export interface CredentialForm {
  name: string;
  url: string;
  username: string;
  password: string;
  tag: string;
}

export interface CredentialFormInputsProps {
  loading: boolean;
  board: BoardDocument;
  form: UseFormReturnType<
    CredentialForm,
    (values: CredentialForm) => CredentialForm
  >;
}

const CredentialFormInputs: FC<CredentialFormInputsProps> = ({
  loading,
  form,
  board,
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
      <Select
        label="Étiquette"
        data={board?.tags ?? []}
        placeholder="John Doe"
        itemComponent={({ value, ...rest }) => {
          return (
            <div {...rest}>
              <Badge variant="dot" color="red">
                {value}
              </Badge>
            </div>
          );
        }}
        clearable
        styles={(theme) => ({
          item: {
            "&[data-selected]": {
              "&, &:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.gray[9]
                    : theme.white,
              },
              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.gray[8]
                    : theme.colors.gray[1],
              },
            },
          },
        })}
        {...form.getInputProps("tag")}
      />
    </>
  );
};

export default CredentialFormInputs;
