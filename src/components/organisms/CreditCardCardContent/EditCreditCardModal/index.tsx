import { Button, Group, Stack, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import CreditCardFormInputs from "components/organisms/CreditCardFormInputs";
import { updateDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useMemo } from "react";
import { BoardDocument, CreditCardDocument } from "types/firebase/collections";

export interface EditCreditCardModalProps {
  boards: BoardDocument[];
  creditCard: CreditCardDocument;
}

const EditCreditCardModal: FC<EditCreditCardModalProps> = ({
  boards,
  creditCard,
}) => {
  const [loading, start, stop] = useBooleanState();
  const theme = useMantineTheme();

  const board = useMemo(() => {
    return boards.find(
      (board) => board.id === creditCard.ref?.parent.parent?.id
    );
  }, [boards, creditCard.ref?.parent.parent?.id]);

  const form = useForm({
    initialValues: {
      color: creditCard.color || "",
      name: creditCard.name || "",
      cardholder: creditCard.cardholder || "",
      number: creditCard.number || "",
      expirationDate: `${creditCard.expirationMonth}/${creditCard.expirationYear}`,
      securityCode: creditCard.securityCode || "",
      tag: creditCard.tag || "",
      boardId: board?.id,
    },

    validate: {
      boardId: (boardId?: string) => {
        return boards.find((board) => board.id === boardId)
          ? null
          : "Ce champ ne doit pas être vide";
      },
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
            name: values.name.trim(),
            number: values.number.replace(/ +/g, ""),
            cardholder: values.cardholder.trim(),
            expirationMonth: expirationMonth,
            expirationYear: expirationYear,
            securityCode: values.securityCode,
            tag: values.tag,
          })
            .then(() => closeAllModals())
            .finally(stop);
        }
      })}
    >
      <Stack>
        <CreditCardFormInputs loading={loading} form={form} boards={boards} />
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
