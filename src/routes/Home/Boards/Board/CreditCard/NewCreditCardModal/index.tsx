import { Button, Group, Stack, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import CreditCardFormInputs from "components/organisms/CreditCardFormInputs";
import { addDoc, collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useMemo } from "react";
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
