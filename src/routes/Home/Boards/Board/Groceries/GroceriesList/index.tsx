import { Card, Stack, Text } from "@mantine/core";
import { IconLayoutList } from "@tabler/icons-react";
import NoResult from "components/organisms/NoResult";
import { groupBy, orderBy } from "lodash";
import { FC, useMemo } from "react";
import GroceryCardContent from "routes/Home/Boards/Board/Groceries/GroceriesList/GroceryCardContent";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { searchString } from "utils/string";

export interface GroceriesListProps {
  search: string;
}

const GroceriesList: FC<GroceriesListProps> = ({ search }) => {
  const { groceries } = useBoard();

  const filteredGroceries = useMemo(() => {
    return groupBy(
      orderBy(
        (groceries ?? []).filter((grocery) => {
          return searchString(`${grocery.name}`, search);
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
        return (
          <Card key={grocery.id} withBorder>
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
    </Stack>
  );
};

export default GroceriesList;
