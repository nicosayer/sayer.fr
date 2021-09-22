import React from "react";

import { Box } from "components/Box";
import { Skills } from "components/Skills";
import { Skill } from "config/skills";

export const Stoik = () => {
  return (
    <Box>
      <Box style={{ fontWeight: 600 }}>CPO • Co-founder</Box>
      <Box>Created the product from A to Z</Box>
      <Skills
        skills={[
          Skill.typescript,
          Skill.reactJs,
          Skill.nodeJs,
          Skill.firebase,
          Skill.mySql,
          Skill.xstyled,
          Skill.algolia,
        ]}
      />
    </Box>
  );
};
