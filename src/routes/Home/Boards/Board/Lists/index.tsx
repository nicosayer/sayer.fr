import { Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import useWindowSize from "hooks/useWindowSize";
import { FC, useState } from "react";
import List from "routes/Home/Boards/Board/Lists/List";
import ListsList from "routes/Home/Boards/Board/Lists/ListsList";
import NewListModalContent from "routes/Home/Boards/Board/Lists/NewListModalContent";
import { useBoard } from "routes/Home/Boards/Board/Provider";

const openNewModal = () => {
  openModal({
    centered: true,
    title: "Nouvelle liste",
    children: <NewListModalContent />,
  });
};

const Lists: FC = () => {
  const { loadingLists, lists } = useBoard();
  const [search, setSearch] = useState("");
  const { largerThan } = useWindowSize()

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
          {largerThan('sm') ? "Ajouter votre première liste" : "Nouvelle liste"}
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
