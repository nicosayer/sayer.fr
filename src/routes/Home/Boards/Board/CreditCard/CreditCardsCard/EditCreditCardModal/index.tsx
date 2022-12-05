import {
  Button,
  CheckIcon,
  ColorSwatch,
  Group,
  Input,
  InputBase,
  Stack,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { updateDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import InputMask from "react-input-mask";
import { CreditCardDocument } from "types/firebase/collections";

export interface EditCreditCardModalProps {
  creditCard: CreditCardDocument;
}

const EditCreditCardModal: FC<EditCreditCardModalProps> = ({ creditCard }) => {
  const [loading, start, stop] = useBooleanState();
  const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      color: creditCard.color || "",
      name: creditCard.name || "",
      cardholder: creditCard.cardholder || "",
      number: creditCard.number || "",
      expirationDate: `${creditCard.expirationMonth ?? "01"}/${String(
        creditCard.expirationYear ?? 2000
      ).slice(-2)}`,
      securityCode: creditCard.securityCode || "",
    },

    validate: {
      name: (name) => {
        return name.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
      color: (color) => {
        return theme.colors[color][6] ? null : "Ce champ ne doit pas être vide";
      },
      cardholder: (cardholder) => {
        return cardholder.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
      number: (number) => {
        return number.length === 19 ? null : "Ce champ ne doit pas être vide";
      },
      expirationDate: (expirationDate) => {
        return expirationDate.length === 5
          ? null
          : "Ce champ ne doit pas être vide";
      },
      securityCode: (securityCode) => {
        return securityCode.length === 3 || securityCode.length === 4
          ? null
          : "Ce champ ne doit pas être vide";
      },
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (creditCard?.ref) {
          const [expirationMonth, expirationYear] =
            values.expirationDate.split("/");

          start();
          updateDoc<CreditCardDocument>(creditCard.ref, {
            color: values.color,
            name: values.name,
            number: values.number.replace(/ +/g, ""),
            cardholder: values.cardholder,
            expirationMonth: Number(expirationMonth),
            expirationYear: Number(expirationYear) + 2000,
            securityCode: values.securityCode,
          })
            .then(() => closeAllModals())
            .finally(stop);
        }
      })}
    >
      <Stack>
        <TextInput
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
                {form.getInputProps("color").value === color ? (
                  <CheckIcon width={10} />
                ) : null}
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
          mask="99/99"
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
        <div className="flex ml-auto">
          <Group>
            <Button
              variant="outline"
              color="dark"
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

export default EditCreditCardModal;
