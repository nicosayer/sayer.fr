import { Button, Group, Stack, Title } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconPlus } from "@tabler/icons";
import { FC } from "react";
import { useBoard } from "../Provider";
import CredentialsCard from "./Cards/Credentials";
import NewCredentialModal from "./NewCredentialModal";

const Credentials: FC = () => {
  const { board } = useBoard();
  return (
    <Stack>
      <Group position="apart">
        <Title order={3}>Mot de passes</Title>
        <Button
          variant="subtle"
          leftIcon={<IconPlus />}
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
      <CredentialsCard />
    </Stack>
  );
};

export default Credentials;
