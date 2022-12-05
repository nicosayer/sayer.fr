import {
  Button,
  Group,
  Input,
  NumberInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import dayjs from "dayjs";
import { updateDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { CreditCardDocument } from "types/firebase/collections";

export interface EditCreditCardModalProps {
  creditCard: CreditCardDocument;
}

const EditCreditCardModal: FC<EditCreditCardModalProps> = ({ creditCard }) => {
  const [loading, start, stop] = useBooleanState();

  const form = useForm({
    initialValues: {
      name: creditCard.name || "",
      cardholder: creditCard.cardholder || "",
      number: creditCard.number || "",
      expirationMonth: creditCard.expirationMonth,
      expirationYear: creditCard.expirationYear,
      securityCode: creditCard.securityCode || "",
    },

    validate: {
      name: (name) => {
        return name.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
      cardholder: (cardholder) => {
        return cardholder.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
      number: (number) => {
        return number.length > 0 ? null : "Ce champ ne doit pas être vide";
      },
      expirationMonth: (expirationMonth?: number) => {
        return expirationMonth && expirationMonth > 0 && expirationMonth < 13
          ? null
          : "Ce champ ne doit pas être vide";
      },
      expirationYear: (expirationYear?: number) => {
        return expirationYear && expirationYear > 0
          ? null
          : "Ce champ ne doit pas être vide";
      },
      securityCode: (securityCode) => {
        return securityCode.length > 0
          ? null
          : "Ce champ ne doit pas être vide";
      },
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (creditCard?.ref && values.expirationYear) {
          start();
          updateDoc<CreditCardDocument>(creditCard.ref, {
            name: values.name,
            number: values.number,
            cardholder: values.cardholder,
            expirationYear:
              values.expirationYear < 100
                ? values.expirationYear + 2000
                : values.expirationYear,
            expirationMonth: values.expirationMonth,
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
        <TextInput
          disabled={loading}
          withAsterisk
          label="Nom du titulaire"
          placeholder="John Doe"
          {...form.getInputProps("cardholder")}
        />
        <TextInput
          disabled={loading}
          withAsterisk
          label="Numéros"
          placeholder="1234 5678 9012 3456"
          {...form.getInputProps("number")}
        />
        <Input.Wrapper label="Date d'expiration" withAsterisk>
          <Group grow>
            <NumberInput
              hideControls
              min={1}
              max={12}
              disabled={loading}
              withAsterisk
              placeholder={dayjs().month() + 1}
              {...form.getInputProps("expirationMonth")}
            />
            <NumberInput
              hideControls
              min={1}
              max={dayjs().year() + 20}
              disabled={loading}
              withAsterisk
              placeholder={dayjs().year()}
              {...form.getInputProps("expirationYear")}
            />
          </Group>
        </Input.Wrapper>
        <TextInput
          disabled={loading}
          withAsterisk
          label="Code de sécurité"
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
