import {
  CheckIcon,
  ColorSwatch,
  Group,
  Input,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { FC } from "react";
import { IMaskInput } from "react-imask";

export interface CreditCardFormInput {
  color: string;
  name: string;
  cardholder: string;
  number: string;
  expirationDate: string;
  securityCode: string;
}

export interface CreditCardFormOutput {
  color: string;
  name: string;
  cardholder: string;
  number: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
}

export interface CreditCardFormInputsProps {
  loading: boolean;
  form: UseFormReturnType<
    CreditCardFormInput,
    (values: CreditCardFormInput) => CreditCardFormOutput
  >;
}

const CreditCardFormInputs: FC<CreditCardFormInputsProps> = ({
  form,
  loading,
}) => {
  const theme = useMantineTheme();

  return (
    <>
      <TextInput
        data-autofocus
        autoFocus
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
      <Input.Wrapper id="number" withAsterisk label="Numéro de la carte">
        <Input<any>
          id="number"
          component={IMaskInput}
          mask="0000 0000 0000 0000"
          placeholder="1234 1234 1234 1234"
          {...form.getInputProps("number")}
        />
      </Input.Wrapper>
      <Input.Wrapper id="expirationDate" withAsterisk label="Date d'expiration">
        <Input<any>
          id="expirationDate"
          component={IMaskInput}
          mask="00/00"
          placeholder="MM/AA"
          {...form.getInputProps("expirationDate")}
        />
      </Input.Wrapper>
      <Input.Wrapper id="securityCode" withAsterisk label="Code de sécurité">
        <Input<any>
          id="securityCode"
          component={IMaskInput}
          mask="0000"
          placeholder="123"
          {...form.getInputProps("securityCode")}
        />
      </Input.Wrapper>
    </>
  );
};

export default CreditCardFormInputs;
