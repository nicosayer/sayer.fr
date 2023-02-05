import { Stack, Text } from "@mantine/core";
import { IconLayoutList } from "@tabler/icons";
import NoResult from "components/organisms/NoResult";
import { groupBy, orderBy } from "lodash";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { searchString } from "utils/string";
import ClosedGroceryCard from "./ClosedGroceryCard";
import OpenedGroceryCard from "./OpenedGroceryCard";

export interface GroceriesListProps {
  search: string;
}

const GroceriesList: FC<GroceriesListProps> = ({ search }) => {
  const { groceries } = useBoard();

  const filteredGroceries = useMemo(() => {
    return groupBy(
      orderBy(
        (groceries ?? []).filter((grocery) => {
          return searchString(`${grocery.name}${grocery.tag}`, search);
        }),
        (grocery) => grocery.updatedAt?.seconds,
        "desc"
      ),
      (grocery) => Boolean(grocery.closedAt)
    );
  }, [groceries, search]);

  if (!groceries?.length) {
    return (
      <div className="my-10 text-center">
        <IconLayoutList size={36} className="text-gray-500" />
        <Text c="dimmed">Aucune course</Text>
      </div>
    );
  }

  if (
    (filteredGroceries.false ?? []).length +
      (filteredGroceries.true ?? []).length ===
    0
  ) {
    return <NoResult />;
  }

  return (
    <Stack>
      {(filteredGroceries.false ?? []).map((grocery) => {
        return <OpenedGroceryCard key={grocery.id} grocery={grocery} />;
      })}
      {(filteredGroceries.true ?? []).map((grocery) => {
        return <ClosedGroceryCard key={grocery.id} grocery={grocery} />;
      })}
    </Stack>
  );
};

export default GroceriesList;
