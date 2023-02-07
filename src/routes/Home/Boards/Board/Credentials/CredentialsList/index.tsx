import { Stack } from "@mantine/core";
import NoResult from "components/organisms/NoResult";
import useGetTags from "hooks/useGetTags";
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
  const getTags = useGetTags();

  const filteredCredentials = useMemo(() => {
    return sortBy(
      (credentials ?? []).filter((credential) => {
        const tags = getTags(credential.tags);

        return searchString(
          `${credential.name}${tags.map((tag) => tag.name)}`,
          search
        );
      }),
      (credential) => sanitize(String(credential.name))
    );
  }, [credentials, search, getTags]);

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
