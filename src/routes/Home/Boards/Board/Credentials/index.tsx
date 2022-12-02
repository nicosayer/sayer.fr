import { Stack, Title } from "@mantine/core";
import { FC } from "react";
import CredentialsCard from "./Cards/Credentials";

const Credentials: FC = () => {
  return (
    <Stack>
      <Title order={3}>Mot de passes</Title>
      <CredentialsCard />
    </Stack>
  );
};

export default Credentials;
