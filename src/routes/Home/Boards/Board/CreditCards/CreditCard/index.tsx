import { Modal } from "@mantine/core";
import CreditCardCardContent from "components/organisms/CreditCardCardContent";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBoard } from "../../Provider";

const CreditCard: FC = () => {
  const { creditCards } = useBoard();
  const { boardId, creditCardId } = useParams();
  const navigate = useNavigate();

  const creditCard = useMemo(() => {
    return creditCards?.find((creditCard) => creditCard.id === creditCardId);
  }, [creditCardId, creditCards]);

  if (!creditCard) {
    return null;
  }

  return (
    <Modal
      opened={Boolean(creditCardId)}
      onClose={() => navigate(`/boards/${boardId}/credit-cards`)}
      withCloseButton={false}
      centered
      trapFocus={false}
      size="xl"
    >
      <CreditCardCardContent creditCard={creditCard} />
    </Modal>
  );
};

export default CreditCard;
