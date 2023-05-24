import { Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { openModal } from "@mantine/modals";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import { FC, useState } from "react";
import { useBoard } from "../Provider";
import List from "./List";
import ListsList from "./ListsList";
import NewListModal from "./NewListModal";

const openNewModal = () => {
  openModal({
    centered: true,
    title: "Nouvelle liste",
    children: <NewListModal />,
  });
};

const Lists: FC = () => {
  const { loadingLists, lists } = useBoard();
  const [search, setSearch] = useState("");
  const is768Px = useMediaQuery("(min-width: 768px)", true);

  if (!lists || loadingLists) {
    return <LoadingOverlay visible />;
  }

  if (!lists?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <Button
          size="lg"
          leftIcon={<IconPlus size={18} />}
          onClick={openNewModal}
        >
          {is768Px ? "Ajouter votre première liste" : "Nouvelle liste"}
        </Button>
      </div>
    );
  }

  return (
    <>
      <List />
      <Stack>
        <Group position="apart">
          <Group spacing="xs">
            <Text weight={500}>Listes</Text>
            <Text c="dimmed">({lists.length})</Text>
          </Group>
          <Group>
            <TextInput
              placeholder="Rechercher"
              variant="filled"
              icon={<IconSearch size={18} />}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
            <Button
              variant="default"
              leftIcon={<IconPlus size={18} />}
              onClick={openNewModal}
            >
              Nouvelle liste
            </Button>
          </Group>
        </Group>
        <ListsList search={search} />
      </Stack>
    </>
  );
};

export default Lists;
