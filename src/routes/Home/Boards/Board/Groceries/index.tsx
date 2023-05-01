import { Group, Stack, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import { FC, useState } from "react";
import { useBoard } from "../Provider";
import GroceriesList from "./GroceriesList";
import NewGroceryCard from "./NewGroceryCard";

const Groceries: FC = () => {
  const { loadingGroceries, groceries } = useBoard();
  const [search, setSearch] = useState("");

  if (!groceries || loadingGroceries) {
    return <LoadingOverlay visible />;
  }

  return (
    <Stack>
      <Group position="apart" className="sticky z-50">
        <Text weight={500}>Courses</Text>
        <TextInput
          placeholder="Rechercher"
          variant="filled"
          icon={<IconSearch size={18} />}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />
      </Group>
      <NewGroceryCard />
      <GroceriesList search={search} />
    </Stack>
  );
};

export default Groceries;
