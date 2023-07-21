import { CloseButton, Group, Stack, Text, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GroceriesList from "routes/Home/Boards/Board/Groceries/GroceriesList";
import NewGroceryCard from "routes/Home/Boards/Board/Groceries/NewGroceryCard";
import { useBoard } from "routes/Home/Boards/Board/Provider";

const Groceries: FC = () => {
  const { loadingGroceries, groceries } = useBoard();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("s") ?? "");
  const [debouncedSearch] = useDebouncedValue(search, 200);

  useEffect(() => {
    setSearchParams(debouncedSearch ? { s: debouncedSearch } : undefined);
  }, [debouncedSearch, setSearchParams]);

  if (!groceries || loadingGroceries) {
    return <LoadingOverlay visible />;
  }

  return (
    <Stack>
      <Group position="apart" className="sticky z-50">
        <Group spacing="xs">
          <Text weight={500}>Courses</Text>
          <Text c="dimmed">
            ({groceries.filter((grocery) => !grocery.closedAt).length})
          </Text>
        </Group>
        <TextInput
          placeholder="Rechercher"
          variant="filled"
          icon={<IconSearch size={18} />}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          rightSection={
            search && (
              <CloseButton
                onClick={() => {
                  setSearch("");
                }}
              />
            )
          }
        />
      </Group>
      <NewGroceryCard />
      <GroceriesList search={debouncedSearch} />
    </Stack>
  );
};

export default Groceries;
