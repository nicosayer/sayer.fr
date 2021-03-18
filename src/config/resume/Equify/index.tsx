import React from "react";

import { Box } from "components/Box";
import { Skills } from "components/Skills";
import { Skill } from "config/skills";

export const Equify = () => {
  return (
    <Box>
      <Box style={{ fontWeight: 600 }}>Full stack engineer • 1st employee</Box>
      <Box>Created the product from A to Z</Box>
      <Skills
        skills={[
          Skill.typescript,
          Skill.reactJs,
          Skill.nodeJs,
          Skill.graphQL,
          Skill.redis,
          Skill.postgreSql,
          Skill.xstate,
          Skill.algolia,
          Skill.excelJs,
        ]}
      />
    </Box>
  );
};
