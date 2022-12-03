import { Button, Group, Stack, TextInput, Title } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconPlus, IconSearch } from "@tabler/icons";
import { FC, useState } from "react";
import { useBoard } from "../Provider";
import DocumentsCards from "./DocumentsCard";
import NewDocumentModal from "./NewDocumentModal";

const Documents: FC = () => {
  const { board, documents } = useBoard();
  const [search, setSearch] = useState("");

  if (!documents?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <Button
          size="lg"
          leftIcon={<IconPlus size={18} />}
          onClick={() => {
            if (board) {
              openModal({
                centered: true,
                title: "Nouveau document",
                children: <NewDocumentModal board={board} />,
              });
            }
          }}
        >
          Ajouter votre premier document
        </Button>
      </div>
    );
  }

  return (
    <Stack>
      <Group position="apart">
        <Title order={3}>Documents</Title>
        <Group>
          <TextInput
            placeholder="Recherche"
            variant="filled"
            icon={<IconSearch size={18} />}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
          <Button
            variant="subtle"
            leftIcon={<IconPlus size={18} />}
            color="dark"
            onClick={() => {
              if (board) {
                openModal({
                  centered: true,
                  title: "Nouveau document",
                  children: <NewDocumentModal board={board} />,
                });
              }
            }}
          >
            Nouveau document
          </Button>
        </Group>
      </Group>
      <DocumentsCards search={search} />
    </Stack>
  );
};

export default Documents;
