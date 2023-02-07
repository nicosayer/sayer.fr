import { Stack } from "@mantine/core";
import NoResult from "components/organisms/NoResult";
import useGetTags from "hooks/useGetTags";
import { sortBy } from "lodash";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { sanitize, searchString } from "utils/string";
import CreditCardCard from "./CreditCardCard";

export interface CreditCardsListProps {
  search: string;
}

const CreditCardsList: FC<CreditCardsListProps> = ({ search }) => {
  const { creditCards } = useBoard();
  const getTags = useGetTags();

  const filteredCreditCards = useMemo(() => {
    return sortBy(
      (creditCards ?? []).filter((creditCard) => {
        const tags = getTags(creditCard.tags);

        return searchString(
          `${creditCard.name}${tags.map((tag) => tag.name)}`,
          search
        );
      }),
      (creditCard) => sanitize(String(creditCard.name))
    );
  }, [creditCards, search, getTags]);

  if (!filteredCreditCards.length) {
    return <NoResult />;
  }

  return (
    <Stack>
      {filteredCreditCards.map((creditCard) => {
        return <CreditCardCard key={creditCard.id} creditCard={creditCard} />;
      })}
    </Stack>
  );
};

export default CreditCardsList;
