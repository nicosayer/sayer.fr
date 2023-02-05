import { Card } from "@mantine/core";
import CreditCardCardContent from "components/organisms/CreditCardCardContent";
import { FC } from "react";
import { CreditCardDocument } from "types/firebase/collections";

export interface CreditCardCardProps {
  creditCard: CreditCardDocument;
}

const CreditCardCard: FC<CreditCardCardProps> = ({ creditCard }) => {
  return (
    <Card withBorder>
      <CreditCardCardContent creditCard={creditCard} />
    </Card>
  );
};

export default CreditCardCard;
