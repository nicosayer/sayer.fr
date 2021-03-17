import { Typography } from "antd";
import React from "react";

import { Box } from "components/Box";

const { Text } = Typography;

export const HelloGaston = () => {
  return (
    <Box>
      <Box style={{ fontWeight: 600 }}>Co-founder & CTO</Box>
      <Box>
        <Text code>NodeJS</Text>
        <Text code>MongoDB</Text>
      </Box>
    </Box>
  );
};
