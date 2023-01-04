import { Button, Group, Stack, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import CreditCardFormInputs from "components/organisms/CreditCardFormInputs";
import { addDoc, collection } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import useDefaultBoardId from "hooks/useDefaultBoardId";
import { FC, useMemo } from "react";
import {
  BoardDocument,
  Collection,
  CreditCardDocument,
} from "types/firebase/collections";

export interface NewCreditCardModalProps {
  boards: BoardDocument[];
}

const NewCreditCardModal: FC<NewCreditCardModalProps> = ({ boards }) => {
  const [loading, start, stop] = useBooleanState();
  const theme = useMantineTheme();
  const { defaultBoardId, setDefaultBoardId } = useDefaultBoardId();

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
      tag: "",
      boardId: boards.length === 1 ? boards[0].id : defaultBoardId,
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
        const board = boards.find((board) => board.id === values.boardId);

        if (board?.id && board.ref) {
          start();
          const [expirationMonth, expirationYear] =
            values.expirationDate.split("/");
          setDefaultBoardId(board.id);
          addDoc<CreditCardDocument>(
            collection(board.ref, Collection.creditCards),
            {
              color: values.color,
              name: values.name.trim(),
              number: values.number.replace(/ +/g, ""),
              expirationMonth: expirationMonth,
              expirationYear: expirationYear,
              cardholder: values.cardholder.trim(),
              securityCode: values.securityCode,
              tag: values.tag,
            }
          )
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
              Ajouter
            </Button>
          </Group>
        </div>
      </Stack>
    </form>
  );
};

export default NewCreditCardModal;
