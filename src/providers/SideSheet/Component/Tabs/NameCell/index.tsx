import { Avatar, Table, Text } from "evergreen-ui";
import React from "react";

import { Box } from "components/Box";
import { IFirebaseRelative } from "config/relative";

export const NameCell = ({ data }: { data?: IFirebaseRelative }) => {
  return (
    <Table.TextCell flexGrow={2}>
      {data && (
        <Box style={{ display: "flex", alignItems: "center" }}>
          <Avatar name={`${data.firstName} ${data.lastName}`} marginRight={8} />
          <Text>
            {data.firstName} {data.lastName}
          </Text>
          <Text color="muted" marginLeft={8} marginRight={8}>
            {data.gender ? "♀" : "♂"}
          </Text>
          {(data.birthDate?.year || data.deathDate?.year) && (
            <Text color="muted">
              (
              {data.birthDate?.year && data.deathDate?.year
                ? `${data.birthDate.year} → ${data.deathDate.year}`
                : data.birthDate?.year
                ? data.birthDate?.year
                : `? → ${data.deathDate.year}`}
              )
            </Text>
          )}
        </Box>
      )}
    </Table.TextCell>
  );
};
