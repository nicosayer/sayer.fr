import {
  CheckIcon,
  ColorSwatch,
  Group,
  Input,
  InputBase,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import TagSelect from "components/molecules/Select/Tag";
import { FieldValue } from "firebase/firestore";
import { FC } from "react";
import InputMask from "react-input-mask";
import { BoardDocument } from "types/firebase/collections";

export interface CreditCardFormInput {
  color: string;
  name: string;
  cardholder: string;
  number: string;
  expirationDate: string;
  securityCode: string;
  tag: string;
}

export interface CreditCardFormOutput {
  color: string;
  name: string;
  cardholder: string;
  number: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
  tag?: string | FieldValue;
}

export interface CreditCardFormInputsProps {
  loading: boolean;
  board: BoardDocument;
  form: UseFormReturnType<
    CreditCardFormInput,
    (values: CreditCardFormInput) => CreditCardFormOutput
  >;
}

const CreditCardFormInputs: FC<CreditCardFormInputsProps> = ({
  form,
  board,
  loading,
}) => {
  const theme = useMantineTheme();

  return (
    <>
      <TextInput
        data-autofocus
        withAsterisk
        disabled={loading}
        label="Nom de la carte"
        placeholder="Revolut"
        {...form.getInputProps("name")}
      />
      <Input.Wrapper label="Couleur de la carte" withAsterisk>
        <Group spacing="xs" className="mt-1">
          {Object.keys(theme.colors).map((color) => (
            <ColorSwatch
              key={color}
              color={theme.colors[color][6]}
              className="text-white cursor-pointer"
              onClick={() => {
                form.getInputProps("color").onChange(color);
              }}
            >
              {form.values.color === color ? <CheckIcon width={10} /> : null}
            </ColorSwatch>
          ))}
        </Group>
      </Input.Wrapper>
      <TextInput
        disabled={loading}
        withAsterisk
        label="Nom du titulaire sur la carte"
        placeholder="John Doe"
        {...form.getInputProps("cardholder")}
      />
      <InputBase
        label="Numéro de la carte"
        withAsterisk
        component={InputMask}
        mask="9999 9999 9999 9999"
        maskChar={null}
        placeholder="1234 1234 1234 1234"
        {...form.getInputProps("number")}
      />
      <InputBase
        label="Date d'expiration"
        withAsterisk
        component={InputMask}
        mask="19/99"
        formatChars={{
          "1": "[0-1]",
          "9": "[0-9]",
        }}
        maskChar={null}
        placeholder="MM/AA"
        {...form.getInputProps("expirationDate")}
      />
      <InputBase
        label="Code de sécurité"
        withAsterisk
        component={InputMask}
        mask="9999"
        maskChar={null}
        placeholder="123"
        {...form.getInputProps("securityCode")}
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

export default CreditCardFormInputs;
