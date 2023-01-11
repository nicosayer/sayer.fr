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
import CannotBeSecure from "components/organisms/CannotBeSecure";
import SecureLogin from "components/organisms/SecureLogin";
import useIsSecure from "hooks/useIsSecure";
import { FC, useState } from "react";
import { useBoard } from "../Provider";
import Credential from "./Credential";
import CredentialsCards from "./CredentialsCards";
import NewCredentialModal from "./NewCredentialModal";

const Credentials: FC = () => {
  const { isSecure, cannotBeSecure } = useIsSecure();
  const { board, loadingCredentials, credentials } = useBoard();
  const [search, setSearch] = useState("");
  const is768Px = useMediaQuery("(min-width: 768px)");

  if (!cannotBeSecure) {
    return <CannotBeSecure />;
  }

  if (!isSecure) {
    return <SecureLogin />;
  }

  if (!credentials || loadingCredentials) {
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
          {is768Px
            ? "Ajouter votre premier mot de passe"
            : "Nouveau mot de passe"}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Credential />
      <Stack>
        <Group position="apart" className="sticky z-50">
          <Text fw={500}>Mots de passe</Text>
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
