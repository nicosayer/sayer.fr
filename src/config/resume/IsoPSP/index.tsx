import React from "react";

import { Box } from "components/Box";
import { Skills } from "components/Skills";
import { Skill } from "config/skills";

export const IsoPSP = () => {
  return (
    <Box>
      <Box style={{ fontWeight: 600 }}>Founder</Box>
      <Skills skills={[Skill.html, Skill.javascript, Skill.mySql, Skill.php]} />
    </Box>
  );
};
