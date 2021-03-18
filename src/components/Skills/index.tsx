import { Typography } from "antd";
import { uniq } from "lodash/fp";
import React from "react";

import { Box } from "components/Box";
import { Skill } from "config/skills";

const { Text } = Typography;

export const Skills = ({ skills }: { skills: Skill[] }) => {
  return (
    <Box style={{ display: "inline-block", maxWidth: "300px" }}>
      {uniq(skills)
        .sort((a, b) => {
          return a.toLowerCase().localeCompare(b.toLowerCase());
        })
        .map((skill) => (
          <Text code key={skill} style={{ display: "inline-block" }}>
            {skill}
          </Text>
        ))}
    </Box>
  );
};
