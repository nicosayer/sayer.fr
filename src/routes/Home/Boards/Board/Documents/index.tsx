import {
  Button,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { openModal } from "@mantine/modals";
import { IconPlus, IconSearch } from "@tabler/icons";
import { FC, useState } from "react";
import { useBoard } from "../Provider";
import Document from "./Document";
import DocumentsCards from "./DocumentsCards";
import NewDocumentModal from "./NewDocumentModal";

const Documents: FC = () => {
  const { board, loadingDocuments, documents } = useBoard();
  const [search, setSearch] = useState("");
  const is768Px = useMediaQuery("(min-width: 768px)");

  if (!documents || loadingDocuments) {
    return <LoadingOverlay visible />;
  }

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
          {is768Px ? "Ajouter votre premier document" : "Nouveau document"}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Document />
      <Stack>
        <Group position="apart">
          <Text fw={500}>Documents</Text>
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
    </>
  );
};

export default Documents;
