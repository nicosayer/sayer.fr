import { Stack } from "@mantine/core";
import NoResult from "components/organisms/NoResult";
import Pagination from "components/organisms/Pagination";
import { sortBy } from "lodash";
import PaginationProvider from "providers/Pagination";
import { FC, useMemo } from "react";
import CredentialCard from "routes/Home/Boards/Board/Credentials/CredentialsList/CredentialCard";
import { useBoard } from "routes/Home/Boards/Board/Provider";
import { sanitize, searchString } from "utils/string";

export interface CredentialsListProps {
  search: string;
}

const CredentialsList: FC<CredentialsListProps> = ({ search }) => {
  const { credentials } = useBoard();

  const filteredCredentials = useMemo(() => {
    return sortBy(
      (credentials ?? []).filter((credential) => {
        return searchString(credential.name ?? "", search);
      }),
      (credential) => sanitize(String(credential.name))
    );
  }, [credentials, search]);

  if (!filteredCredentials.length) {
    return <NoResult />;
  }

  return (
    <PaginationProvider totalItems={filteredCredentials.length}>
      {({ page, pageSize }) => (
        <Stack>
          {filteredCredentials
            .slice((page - 1) * pageSize, page * pageSize)
            .map((credential) => {
              return (
                <CredentialCard key={credential.id} credential={credential} />
              );
            })}
          <Pagination />
        </Stack>
      )}
    </PaginationProvider>
  );
};

export default CredentialsList;
