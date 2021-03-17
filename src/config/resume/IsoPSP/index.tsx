import { Typography } from "antd";
import React from "react";

import { Box } from "components/Box";

const { Text } = Typography;

export const IsoPSP = () => {
  return (
    <Box>
      <Box style={{ fontWeight: 600 }}>Founder</Box>
      <Box>
        <Text code>HTML</Text>
        <Text code>Javascript</Text>
        <Text code>PHP</Text>
        <br />
        <Text code>MySQL</Text>
      </Box>
    </Box>
  );
};
