import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Stack spacing="xl" className="max-w-xl text-center">
        <Title>404</Title>
        <Title>Vous avez trouvé un endroit secret.</Title>
        <Text color="dimmed" size="lg" align="center">
          Malheureusement, ce n'est qu'une page 404. Vous avez peut-être mal
          saisi l'adresse ou la page a été déplacée vers une autre URL.
        </Text>
        <Group position="center">
          <Link to="/">
            <Button variant="subtle" size="md">
              Ramenez-moi à la page d'accueil
            </Button>
          </Link>
        </Group>
      </Stack>
    </div>
  );
};

export default Error;
