import React from "react";

import { Box } from "components/Box";
import { useIsMobileWindowSize } from "hooks/useWindowSize";
import { Legend } from "pages/Home/Legend";
import { Timeline } from "pages/Home/Timeline";

export const Home = () => {
  const isMobileWindowSize = useIsMobileWindowSize();

  return (
    <Box
      style={{
        padding: isMobileWindowSize
          ? "50px 50px 200px 50px"
          : "100px 50px 200px 50px",
      }}
    >
      <Timeline />
      <Legend />
    </Box>
  );
};
