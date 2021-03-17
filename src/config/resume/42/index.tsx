import { Typography } from "antd";
import React from "react";

import { Box } from "components/Box";

const { Text } = Typography;

export const FortyTwo = () => {
  return (
    <Box>
      <Box style={{ fontWeight: 600 }}>Digital Technologies Architect</Box>
      <Box>Ranked 3rd out of 1,000 at the selection exam.</Box>
      <Box>
        <Text code>C</Text>
        <Text code>Unix</Text>
        <Text code>Shell</Text>
        <br />
        <Text code>Python</Text>
        <Text code>Swift</Text>
        <Text code>NodeJS</Text>
        <br />
        <Text code>MongoDB</Text>
        <Text code>MySQL</Text>
        <Text code>React</Text>
      </Box>
    </Box>
  );
};
