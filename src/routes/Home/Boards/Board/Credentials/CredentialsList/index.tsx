import { Stack } from "@mantine/core";
import NoResult from "components/organisms/NoResult";
import { sortBy } from "lodash";
import { FC, useMemo } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { sanitize, searchString } from "utils/string";
import CredentialCard from "./CredentialCard";

export interface CredentialsListProps {
  search: string;
}

const CredentialsList: FC<CredentialsListProps> = ({ search }) => {
  const { credentials } = useBoard();

  const filteredCredentials = useMemo(() => {
    return sortBy(
      (credentials ?? []).filter((credential) => {
        return searchString(`${credential.name}${credential.tag}`, search);
      }),
      (credential) => sanitize(`${credential.name}${credential.tag}`)
    );
  }, [credentials, search]);

  if (!filteredCredentials.length) {
    return <NoResult />;
  }

  return (
    <Stack>
      {filteredCredentials.map((credential) => {
        return <CredentialCard key={credential.id} credential={credential} />;
      })}
    </Stack>
  );
};

export default CredentialsList;
