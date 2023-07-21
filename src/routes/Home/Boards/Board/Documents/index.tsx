import { Button, Group, Stack, Text } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import SearchTextInput from "components/molecules/TextInput/Search";
import useSearch from "hooks/useSearch";
import useWindowSize from "hooks/useWindowSize";
import { FC } from "react";
import Document from "routes/Home/Boards/Board/Documents/Document";
import DocumentsList from "routes/Home/Boards/Board/Documents/DocumentsList";
import NewDocumentModalContent from "routes/Home/Boards/Board/Documents/NewDocumentModalContent";
import { useBoard } from "routes/Home/Boards/Board/Provider";

const openNewModal = () => {
  openModal({
    centered: true,
    title: "Nouveau document",
    children: <NewDocumentModalContent />,
  });
};

const Documents: FC = () => {
  const { loadingDocuments, documents } = useBoard();
  const { search, setSearch, debouncedSearch } = useSearch();
  const { largerThan } = useWindowSize();

  if (!documents || loadingDocuments) {
    return <LoadingOverlay visible />;
  }

  if (!documents?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <Button
          size="lg"
          leftIcon={<IconPlus size={18} />}
          onClick={openNewModal}
        >
          {largerThan("md")
            ? "Ajouter votre premier document"
            : "Nouveau document"}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Document />
      <Stack>
        <Group position="apart">
          <Group spacing="xs">
            <Text weight={500}>Documents</Text>
            <Text c="dimmed">({documents.length})</Text>
          </Group>
          <Group>
            <SearchTextInput search={search} setSearch={setSearch} />
            <Button
              variant="default"
              leftIcon={<IconPlus size={18} />}
              onClick={openNewModal}
            >
              Nouveau document
            </Button>
          </Group>
        </Group>
        <DocumentsList search={debouncedSearch} />
      </Stack>
    </>
  );
};

export default Documents;
