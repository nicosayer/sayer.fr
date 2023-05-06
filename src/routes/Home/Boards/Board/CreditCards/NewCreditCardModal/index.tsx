import { Button, Group, Stack, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import CreditCardFormInputs from "components/organisms/CreditCardFormInputs";
import { collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { useEncrypt } from "hooks/useCrypto";
import { FC, useMemo } from "react";
import { Collection, CreditCardDocument } from "types/firebase/collections";
import { addDoc } from "utils/firebase";
import { cleanString } from "utils/string";
import { useBoard } from "../../Provider";

const NewCreditCardModal: FC = () => {
  const { board } = useBoard();
  const [loading, start, stop] = useBooleanState();
  const theme = useMantineTheme();
  const { encrypt } = useEncrypt();

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

    transformValues: (values) => {
      const [expirationMonth, expirationYear] =
        values.expirationDate.split("/");

      return {
        color: values.color,
        name: cleanString(values.name),
        number: values.number.replace(/[^0-9]+/g, ""),
        cardholder: cleanString(values.cardholder),
        expirationMonth: expirationMonth,
        expirationYear: expirationYear,
        securityCode: values.securityCode,
      };
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        if (board?.id && board.ref) {
          start();

          const number = await encrypt(values.number);
          const securityCode = await encrypt(values.securityCode);

          addDoc<CreditCardDocument>(
            collection(board.ref, Collection.creditCards),
            {
              color: values.color,
              name: values.name,
              number: number?.data,
              lastDigits: values.number.slice(-4),
              expirationMonth: values.expirationMonth,
              expirationYear: values.expirationYear,
              cardholder: values.cardholder,
              securityCode: securityCode?.data,
            }
          )
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
              Ajouter
            </Button>
          </Group>
        </div>
      </Stack>
    </form>
  );
};

export default NewCreditCardModal;
