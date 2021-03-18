import React from "react";

import { Box } from "components/Box";
import { Skills } from "components/Skills";
import { Skill } from "config/skills";

export const SharePlace = () => {
  return (
    <Box>
      <Box style={{ fontWeight: 600 }}>Full stack engineer • Internship</Box>
      <Skills
        skills={[
          Skill.reactJs,
          Skill.nodeJs,
          Skill.graphQL,
          Skill.redux,
          Skill.mySql,
        ]}
      />
    </Box>
  );
};
