import { Card, Stack } from "@mantine/core";
import CreditCardCardContent from "components/organisms/CreditCardCardContent";
import { sortBy } from "lodash";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { sanitize, searchString } from "utils/string";

export interface CreditCardsCardsProps {
  search: string;
}

const CreditCardsCards: FC<CreditCardsCardsProps> = ({ search }) => {
  const { creditCards } = useBoard();

  const filteredCreditCards = useMemo(() => {
    return sortBy(
      (creditCards ?? []).filter((creditCard) => {
        return searchString(`${creditCard.name}${creditCard.tag}`, search);
      }),
      (creditCard) => sanitize(`${creditCard.name}${creditCard.tag}`)
    );
  }, [creditCards, search]);

  return (
    <Stack>
      {filteredCreditCards.map((creditCard) => {
        return (
          <Card key={creditCard.id} withBorder>
            <CreditCardCardContent creditCard={creditCard} />
          </Card>
        );
      })}
    </Stack>
  );
};

export default CreditCardsCards;
