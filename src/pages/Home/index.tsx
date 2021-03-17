import React from "react";

import { Box } from "components/Box";
import { Legend } from "pages/Home/Legend";
import { Timeline } from "pages/Home/Timeline";

export const Home = () => {
  return (
    <Box style={{ padding: "100px 50px 200px 50px" }}>
      <Timeline />
      <Legend />
    </Box>
  );
};
