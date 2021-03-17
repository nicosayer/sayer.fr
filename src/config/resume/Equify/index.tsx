import { Typography } from "antd";
import React from "react";

import { Box } from "components/Box";

const { Text } = Typography;

export const Equify = () => {
  return (
    <Box>
      <Box style={{ fontWeight: 600 }}>Full stack engineer • 1st employee</Box>
      <Box>Created the product from A to Z</Box>
      <Box>
        <Text code>Typescript</Text>
        <Text code>React</Text>
        <Text code>NodeJS</Text>
        <br />
        <Text code>GraphQL</Text>
        <Text code>Redis</Text>
        <Text code>PostgreSQL</Text>
        <br />
        <Text code>xstate</Text>
        <Text code>Algolia</Text>
        <Text code>exceljs</Text>
      </Box>
    </Box>
  );
};
