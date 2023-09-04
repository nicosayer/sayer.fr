import { Group, Stack, Text } from "@mantine/core";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import SearchTextInput from "components/molecules/TextInput/Search";
import useSearch from "hooks/useSearch";
import { FC } from "react";
import GroceriesList from "routes/Home/Boards/Board/Groceries/GroceriesList";
import NewGroceryCard from "routes/Home/Boards/Board/Groceries/NewGroceryCard";
import { useBoard } from "routes/Home/Boards/Board/Provider";

const Groceries: FC = () => {
  const { loadingGroceries, groceries } = useBoard();
  const { search, setSearch, debouncedSearch } = useSearch();

  if (!groceries || loadingGroceries) {
    return <LoadingOverlay visible />;
  }

  return (
    <Stack>
      <Stack spacing="xs">
        <Group position="apart" className="sticky z-50">
          <Group spacing="xs">
            <Text weight={500}>Courses</Text>
            <Text c="dimmed">
              ({groceries.filter((grocery) => !grocery.closedAt).length})
            </Text>
          </Group>
          <SearchTextInput search={search} setSearch={setSearch} />
        </Group>
        <Text color="dimmed" fz="sm">
          Les courses concernent uniquement les achats quotidiens qui peuvent être achetés au supermarché.
        </Text>
      </Stack>
      <NewGroceryCard />
      <GroceriesList search={debouncedSearch} />
    </Stack>
  );
};

export default Groceries;
