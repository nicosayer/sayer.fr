import { Card } from "@mantine/core";
import ChoreCardContent from "components/organisms/ChoreCardContent";
import { FC } from "react";
import { ChoreDocument } from "types/firebase/collections";
import { formatDate } from "utils/dayjs";

export interface ChoreCardProps {
  chore: ChoreDocument & {
    previousDate: string;
    nextDate: string;
    nextDoneDate: string;
    lastDoneDate: string;
  };
}

const ChoreCard: FC<ChoreCardProps> = ({ chore }) => {
  return (
    <Card
      withBorder
      className={chore.nextDoneDate > formatDate() ? "opacity-50" : ""}
    >
      <ChoreCardContent chore={chore} />
    </Card>
  );
};

export default ChoreCard;
