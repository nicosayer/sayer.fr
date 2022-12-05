import { Button, Group, Stack, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import CreditCardFormInputs from "components/organisms/CreditCardFormInputs";
import { updateDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC } from "react";
import { BoardDocument, CreditCardDocument } from "types/firebase/collections";

export interface EditCreditCardModalProps {
  board: BoardDocument;
  creditCard: CreditCardDocument;
}

const EditCreditCardModal: FC<EditCreditCardModalProps> = ({
  board,
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
      expirationDate: `${creditCard.expirationMonth ?? "01"}/${String(
        creditCard.expirationYear ?? 2000
      ).slice(-2)}`,
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
