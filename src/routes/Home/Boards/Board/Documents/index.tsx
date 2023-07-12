import { Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import useWindowSize from "hooks/useWindowSize";
import { FC, useState } from "react";
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
  const [search, setSearch] = useState("");
  const { largerThan } = useWindowSize()

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
          {largerThan('sm') ? "Ajouter votre premier document" : "Nouveau document"}
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
              Nouveau document
            </Button>
          </Group>
        </Group>
        <DocumentsList search={search} />
      </Stack>
    </>
  );
};

export default Documents;
