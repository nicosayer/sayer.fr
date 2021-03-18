import React from "react";

import { Box } from "components/Box";
import { Skills } from "components/Skills";
import { Skill } from "config/skills";

export const FortyTwo = () => {
  return (
    <Box>
      <Box style={{ fontWeight: 600 }}>Digital Technologies Architect</Box>
      <Box>Ranked 3rd out of 1,000 at the selection exam.</Box>
      <Skills
        skills={[
          Skill.javascript,
          Skill.reactJs,
          Skill.nodeJs,
          Skill.php,
          Skill.mongoDb,
          Skill.mySql,
          Skill.c,
          Skill.python,
          Skill.swift,
          Skill.objectiveC,
          Skill.shell,
          Skill.git,
          Skill.docker,
          Skill.unix,
        ]}
      />
    </Box>
  );
};
