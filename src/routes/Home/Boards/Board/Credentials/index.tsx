import { Button, Group, Stack, Text } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import SearchTextInput from "components/molecules/TextInput/Search";
import SecureLogin from "components/organisms/SecureLogin";
import useSearch from "hooks/useSearch";
import useWindowSize from "hooks/useWindowSize";
import { useSecureLogin } from "providers/SecureLogin";
import { FC } from "react";
import Credential from "routes/Home/Boards/Board/Credentials/Credential";
import CredentialsList from "routes/Home/Boards/Board/Credentials/CredentialsList";
import NewCredentialModalContent from "routes/Home/Boards/Board/Credentials/NewCredentialModalContent";
import { useBoard } from "routes/Home/Boards/Board/Provider";

const openNewModal = () => {
  openModal({
    centered: true,
    title: "Nouveau mot de passe",
    children: <NewCredentialModalContent />,
  });
};

const Credentials: FC = () => {
  const { isSecure } = useSecureLogin();
  const { loadingCredentials, credentials } = useBoard();
  const { search, setSearch, debouncedSearch } = useSearch();

  const { largerThan } = useWindowSize();

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
          {largerThan("md")
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
          <Group spacing="xs">
            <Text weight={500}>Mots de passe</Text>
            <Text c="dimmed">({credentials.length})</Text>
          </Group>
          <Group>
            <SearchTextInput search={search} setSearch={setSearch} />
            <Button
              variant="default"
              leftIcon={<IconPlus size={18} />}
              onClick={openNewModal}
            >
              Nouveau mot de passe
            </Button>
          </Group>
        </Group>
        <CredentialsList search={debouncedSearch} />
      </Stack>
    </>
  );
};

export default Credentials;
