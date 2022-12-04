import {
  Button,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconPlus, IconSearch } from "@tabler/icons";
import { FC, useState } from "react";
import { useBoard } from "../Provider";
import Credential from "./Credential";
import CredentialsCards from "./CredentialsCard";
import NewCredentialModal from "./NewCredentialModal";

const Credentials: FC = () => {
  const { board, credentials } = useBoard();
  const [search, setSearch] = useState("");

  if (!credentials) {
    return <LoadingOverlay visible />;
  }

  if (!credentials?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <Button
          size="lg"
          leftIcon={<IconPlus size={18} />}
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
          Ajouter votre premier mot de passe
        </Button>
      </div>
    );
  }

  return (
    <>
      <Credential />
      <Stack>
        <Group position="apart">
          <Text fw={500}>Mot de passes</Text>
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
    </>
  );
};

export default Credentials;
