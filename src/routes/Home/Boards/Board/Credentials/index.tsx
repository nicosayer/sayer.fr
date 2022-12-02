import { Button, Group, Stack, TextInput, Title } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconPlus, IconSearch } from "@tabler/icons";
import { FC, useState } from "react";
import { useBoard } from "../Provider";
import CredentialsCards from "./CredentialsCard";
import NewCredentialModal from "./NewCredentialModal";

const Credentials: FC = () => {
  const { board } = useBoard();
  const [search, setSearch] = useState("");

  return (
    <Stack>
      <Group position="apart">
        <Title order={3}>Mot de passes</Title>
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
                  title: "Nouveau mot de passe",
                  children: <NewCredentialModal board={board} />,
                });
              }
            }}
          >
            Nouveau mot de passe
          </Button>
        </Group>
      </Group>
      <CredentialsCards search={search} />
    </Stack>
  );
};

export default Credentials;
