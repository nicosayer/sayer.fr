import { Button, Group, Stack, Text } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import SearchTextInput from "components/molecules/TextInput/Search";
import useSearch from "hooks/useSearch";
import useWindowSize from "hooks/useWindowSize";
import { FC } from "react";
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
  const { search, setSearch, debouncedSearch } = useSearch();
  const { largerThan } = useWindowSize();

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
          {largerThan("md") ? "Ajouter votre première liste" : "Nouvelle liste"}
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
            <SearchTextInput search={search} setSearch={setSearch} />
            <Button
              variant="default"
              leftIcon={<IconPlus size={18} />}
              onClick={openNewModal}
            >
              Nouvelle liste
            </Button>
          </Group>
        </Group>
        <ListsList search={debouncedSearch} />
      </Stack>
    </>
  );
};

export default Lists;
