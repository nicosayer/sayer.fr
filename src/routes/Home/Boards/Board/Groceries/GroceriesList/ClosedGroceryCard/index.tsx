import { Card } from "@mantine/core";
import GroceryCardContent from "components/organisms/GroceryCardContent";
import { FC } from "react";
import { GroceryDocument } from "types/firebase/collections";

export interface ClosedGroceryCardsProp {
  grocery: GroceryDocument;
}

const ClosedGroceryCard: FC<ClosedGroceryCardsProp> = ({ grocery }) => {
  return (
    <Card withBorder className="opacity-50">
      <GroceryCardContent grocery={grocery} />
    </Card>
  );
};

export default ClosedGroceryCard;
