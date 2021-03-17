import { Typography } from "antd";
import React from "react";

import { Box } from "components/Box";

const { Text } = Typography;

export const SharePlace = () => {
  return (
    <Box>
      <Box style={{ fontWeight: 600 }}>Full stack engineer • Internship</Box>
      <Box>
        <Text code>React</Text>
        <Text code>NodeJS</Text>
        <Text code>GraphQL</Text>
        <br />
        <Text code>Redux</Text>
        <Text code>MySQL</Text>
      </Box>
    </Box>
  );
};
