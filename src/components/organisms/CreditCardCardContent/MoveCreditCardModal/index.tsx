import { Button, Group, Stack } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import BoardSelect from "components/molecules/Select/Board";
import { collection, deleteDoc } from "firebase/firestore";
import useBooleanState from "hooks/useBooleanState";
import { FC, useState } from "react";
import { useBoards } from "routes/Home/Boards/Provider";
import { Collection, CreditCardDocument } from "types/firebase/collections";
import { addDoc, db } from "utils/firebase";

export interface MoveCreditCardModalProps {
  creditCard: CreditCardDocument;
}

const MoveCreditCardModal: FC<MoveCreditCardModalProps> = ({ creditCard }) => {
  const [loading, start, stop] = useBooleanState();
  const { boards } = useBoards();
  const [boardId, setBoardId] = useState(
    creditCard.ref?.parent.parent?.id ?? null
  );

  return (
    <Stack>
      <BoardSelect
        label="Board"
        placeholder="Board de John Doe"
        boards={boards ?? []}
        disabled={loading}
        value={boardId}
        onChange={(value) => {
          setBoardId(value);
        }}
      />
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
          <Button
            loading={loading}
            onClick={() => {
              start();
              addDoc<CreditCardDocument>(
                collection(db, `boards/${boardId}/${Collection.creditCards}`),
                {
                  name: creditCard.name,
                  cardholder: creditCard.cardholder,
                  number: creditCard.number,
                  expirationMonth: creditCard.expirationMonth,
                  expirationYear: creditCard.expirationYear,
                  securityCode: creditCard.securityCode,
                  color: creditCard.color,
                }
              )
                .then(() => {
                  if (creditCard.ref) {
                    return deleteDoc(creditCard.ref);
                  }
                })
                .then(() => {
                  closeAllModals();
                })
                .finally(stop);
            }}
          >
            Déplacer
          </Button>
        </Group>
      </div>
    </Stack>
  );
};

export default MoveCreditCardModal;
