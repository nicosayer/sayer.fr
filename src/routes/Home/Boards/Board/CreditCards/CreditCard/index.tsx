import { Modal } from "@mantine/core";
import CreditCardCardContent from "components/organisms/CreditCardCardContent";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ALL_BOARDS_SLUG } from "utils/boards";
import { useBoard } from "../../Provider";

const CreditCard: FC = () => {
  const { board, creditCards } = useBoard();
  const { creditCardId } = useParams();
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
      onClose={() =>
        navigate(`/boards/${board?.id ?? ALL_BOARDS_SLUG}/credit-cards`)
      }
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
