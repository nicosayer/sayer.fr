import { Card, Stack } from "@mantine/core";
import CredentialCardContent from "components/organisms/CredentialCardContent";
import { sortBy } from "lodash";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { sanitize, searchString } from "utils/string";

export interface CredentialsCardsProps {
  search: string;
}

const CredentialsCards: FC<CredentialsCardsProps> = ({ search }) => {
  const { credentials } = useBoard();

  const filteredCredentials = useMemo(() => {
    return sortBy(
      (credentials ?? []).filter((credential) => {
        return searchString(`${credential.name}${credential.tag}`, search);
      }),
      (credential) => sanitize(`${credential.name}${credential.tag}`)
    );
  }, [credentials, search]);

  return (
    <Stack>
      {filteredCredentials.map((credential) => {
        return (
          <Card key={credential.id} withBorder>
            <CredentialCardContent credential={credential} />
          </Card>
        );
      })}
    </Stack>
  );
};

export default CredentialsCards;
