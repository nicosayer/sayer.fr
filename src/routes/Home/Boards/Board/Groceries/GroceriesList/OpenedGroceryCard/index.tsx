import { Card } from "@mantine/core";
import GroceryCardContent from "components/organisms/GroceryCardContent";
import { Timestamp } from "firebase/firestore";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { GroceryDocument } from "types/firebase/collections";
import { auth, updateDoc } from "utils/firebase";

export interface OpenedGroceryCardProps {
  grocery: GroceryDocument;
}

const OpenedGroceryCard: FC<OpenedGroceryCardProps> = ({ grocery }) => {
  const [user] = useAuthState(auth);

  return (
    <Card
      withBorder
      className="cursor-pointer"
      onClick={() => {
        if (grocery.ref && user?.email) {
          updateDoc<GroceryDocument>(grocery.ref, {
            closedAt: Timestamp.now(),
            closedBy: user.email,
          });
        }
      }}
    >
      <GroceryCardContent grocery={grocery} />
    </Card>
  );
};

export default OpenedGroceryCard;
