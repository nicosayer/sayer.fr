import React from "react";

import { Box } from "components/Box";
import { Skills } from "components/Skills";
import { Skill } from "config/skills";

export const HelloGaston = () => {
  return (
    <Box>
      <Box style={{ fontWeight: 600 }}>Co-founder & CTO</Box>
      <Skills skills={[Skill.nodeJs, Skill.mongoDb]} />
    </Box>
  );
};
