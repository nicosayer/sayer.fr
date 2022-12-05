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
import { addDoc, collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useMemo } from "react";
import InputMask from "react-input-mask";
import {
  BoardDocument,
  Collection,
  CreditCardDocument,
} from "types/firebase/collections";

export interface NewCreditCardModalProps {
  board: BoardDocument;
}

const NewCreditCardModal: FC<NewCreditCardModalProps> = ({ board }) => {
  const [loading, start, stop] = useBooleanState();
  const theme = useMantineTheme();

  const colors = useMemo(() => {
    return Object.keys(theme.colors);
  }, [theme]);

  const form = useForm({
    initialValues: {
      color: colors[Math.floor(Math.random() * colors.length)],
      name: "",
      cardholder: "",
      number: "",
      expirationDate: "",
      securityCode: "",
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
        if (board?.ref) {
          const [expirationMonth, expirationYear] =
            values.expirationDate.split("/");

          start();
          addDoc<CreditCardDocument>(
            collection(board.ref, Collection.creditCards),
            {
              color: values.color,
              name: values.name,
              number: values.number.replace(/ +/g, ""),
              expirationMonth: Number(expirationMonth),
              expirationYear: Number(expirationYear) + 2000,
              cardholder: values.cardholder,
              securityCode: values.securityCode,
            }
          )
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
              Ajouter
            </Button>
          </Group>
        </div>
      </Stack>
    </form>
  );
};

export default NewCreditCardModal;
