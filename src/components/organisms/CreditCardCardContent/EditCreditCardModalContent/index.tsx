import {
  Button,
  Group,
  LoadingOverlay,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import CreditCardFormInputs from "components/organisms/CreditCardFormInputs";
import useBooleanState from "hooks/useBooleanState";
import { useDecrypt } from "hooks/useCrypto";
import { FC } from "react";
import { CreditCardDocument } from "types/firebase/collections";
import { updateDoc } from "utils/firebase";
import { cleanString } from "utils/string";

export interface EditCreditCardModalContentProps {
  creditCard: CreditCardDocument;
}

const EditCreditCardModalSubContent: FC<EditCreditCardModalContentProps> = ({
  creditCard,
}) => {
  const [loading, start, stop] = useBooleanState();
  const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      color: creditCard.color || "",
      name: creditCard.name || "",
      cardholder: creditCard.cardholder || "",
      number: creditCard.number || "",
      expirationDate: `${creditCard.expirationMonth}/${creditCard.expirationYear}`,
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
        return number.replace(/ +/g, "").length === 16
          ? null
          : "Ce champ ne doit pas être vide";
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

    transformValues: (values) => {
      const [expirationMonth, expirationYear] =
        values.expirationDate.split("/");

      return {
        color: values.color,
        name: cleanString(values.name),
        number: values.number.replace(/ +/g, ""),
        cardholder: cleanString(values.cardholder),
        expirationMonth: expirationMonth,
        expirationYear: expirationYear,
        securityCode: values.securityCode,
      };
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (creditCard?.ref) {
          start();
          updateDoc<CreditCardDocument>(creditCard.ref, {
            color: values.color,
            name: values.name,
            number: values.number,
            cardholder: values.cardholder,
            expirationMonth: values.expirationMonth,
            expirationYear: values.expirationYear,
            securityCode: values.securityCode,
          })
            .then(() => closeAllModals())
            .finally(stop);
        }
      })}
    >
      <Stack>
        <CreditCardFormInputs loading={loading} form={form} />
        <div className="flex ml-auto">
          <Group>
            <Button
              variant="default"
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

const EditCreditCardModalContent: FC<EditCreditCardModalContentProps> = ({
  creditCard,
}) => {
  const { value: number, loading: loadingNumber } = useDecrypt(
    creditCard.number
  );
  const { value: securityCode, loading: loadingSecurityCode } = useDecrypt(
    creditCard.securityCode
  );

  if (loadingNumber || loadingSecurityCode) {
    return (
      <Stack>
        <div className="relative h-[100px]">
          <LoadingOverlay visible />
        </div>
        <div className="flex ml-auto">
          <Group>
            <Button
              variant="default"
              onClick={() => {
                closeAllModals();
              }}
            >
              Annuler
            </Button>
            <Button disabled>Modifier</Button>
          </Group>
        </div>
      </Stack>
    );
  }

  return (
    <EditCreditCardModalSubContent
      creditCard={{ ...creditCard, number, securityCode }}
    />
  );
};

export default EditCreditCardModalContent;
