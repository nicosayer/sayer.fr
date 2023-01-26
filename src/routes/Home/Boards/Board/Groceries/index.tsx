import { Group, Stack, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import { FC, useState } from "react";
import { useBoard } from "../Provider";
import GroceriesCards from "./GroceriesCards";
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
        <Text fw={500}>Courses</Text>
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
      <GroceriesCards search={search} />
    </Stack>
  );
};

export default Groceries;
