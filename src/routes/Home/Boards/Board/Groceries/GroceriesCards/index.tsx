import { Card, Stack, Text } from "@mantine/core";
import { IconLayoutList } from "@tabler/icons";
import GroceryCardContent from "components/organisms/GroceryCardContent";
import dayjs from "dayjs";
import { updateDoc } from "firebase/firestore";
import { groupBy, orderBy } from "lodash";
import { FC, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { GroceryDocument } from "types/firebase/collections";
import { auth } from "utils/firebase";
import { searchString } from "utils/string";

export interface GroceriesCardsProps {
  search: string;
}

const GroceriesCards: FC<GroceriesCardsProps> = ({ search }) => {
  const { groceries } = useBoard();
  const [user] = useAuthState(auth);

  const filteredGroceries = useMemo(() => {
    return groupBy(
      orderBy(
        (groceries ?? []).filter((grocery) => {
          return searchString(`${grocery.name}${grocery.tag}`, search);
        }),
        "order",
        "desc"
      ),
      (grocery) => Boolean(grocery.closeDate)
    );
  }, [groceries, search]);

  return (
    <Stack>
      {(filteredGroceries.false ?? []).map((grocery) => {
        return (
          <Card
            key={grocery.id}
            withBorder
            className="cursor-pointer"
            onClick={() => {
              if (grocery.ref) {
                updateDoc<GroceryDocument>(grocery.ref, {
                  closeDate: dayjs().format("YYYY-MM-DD"),
                  closedBy: user?.email ?? undefined,
                });
              }
            }}
          >
            <GroceryCardContent grocery={grocery} />
          </Card>
        );
      })}
      {(filteredGroceries.true ?? []).map((grocery) => {
        return (
          <Card key={grocery.id} withBorder className="opacity-50">
            <GroceryCardContent grocery={grocery} />
          </Card>
        );
      })}
      {(filteredGroceries.false ?? []).length +
        (filteredGroceries.true ?? []).length ===
        0 && (
        <div className="mt-10 text-center">
          <IconLayoutList size={36} className="text-gray-500" />
          <Text c="dimmed">Aucune course</Text>
        </div>
      )}
    </Stack>
  );
};

export default GroceriesCards;
