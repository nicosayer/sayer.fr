import { Button, Group, Stack, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import CreditCardFormInputs from "components/organisms/CreditCardFormInputs";
import { deleteField } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { BoardDocument, CreditCardDocument } from "types/firebase/collections";
import { updateDoc } from "utils/firebase";

export interface EditCreditCardModalProps {
  creditCard: CreditCardDocument;
  board: BoardDocument;
}

const EditCreditCardModal: FC<EditCreditCardModalProps> = ({
  creditCard,
  board,
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
      tag: creditCard.tag || "",
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
        name: values.name.trim(),
        number: values.number.replace(/ +/g, ""),
        cardholder: values.cardholder.trim(),
        expirationMonth: expirationMonth,
        expirationYear: expirationYear,
        securityCode: values.securityCode,
        tag: values.tag || deleteField(),
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
            tag: values.tag,
          })
            .then(() => closeAllModals())
            .finally(stop);
        }
      })}
    >
      <Stack>
        <CreditCardFormInputs loading={loading} form={form} board={board} />
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

export default EditCreditCardModal;
