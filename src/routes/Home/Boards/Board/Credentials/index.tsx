import { Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { openModal } from "@mantine/modals";
import { IconPlus, IconSearch } from "@tabler/icons";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import CannotBeSecure from "components/organisms/CannotBeSecure";
import SecureLogin from "components/organisms/SecureLogin";
import { useSecureLogin } from "providers/SecureLogin";
import { FC, useState } from "react";
import { useBoard } from "../Provider";
import Credential from "./Credential";
import CredentialsList from "./CredentialsList";
import NewCredentialModal from "./NewCredentialModal";

const openNewModal = () => {
  openModal({
    centered: true,
    title: "Nouveau mot de passe",
    children: <NewCredentialModal />,
  });
};

const Credentials: FC = () => {
  const { isSecure, cannotBeSecure } = useSecureLogin();
  const { loadingCredentials, credentials } = useBoard();
  const [search, setSearch] = useState("");
  const is768Px = useMediaQuery("(min-width: 768px)", true);

  if (cannotBeSecure) {
    return (
      <div className="py-10">
        <CannotBeSecure />
      </div>
    );
  }

  if (!isSecure) {
    return (
      <div className="py-10">
        <SecureLogin />
      </div>
    );
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
          onClick={openNewModal}
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
          <Text weight={500}>Mots de passe</Text>
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
              Nouveau mot de passe
            </Button>
          </Group>
        </Group>
        <CredentialsList search={search} />
      </Stack>
    </>
  );
};

export default Credentials;
