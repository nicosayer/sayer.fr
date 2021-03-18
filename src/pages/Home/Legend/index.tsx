import { Card, Typography } from "antd";
import React, { ReactNode } from "react";

import { Box } from "components/Box";
import { Color } from "config/resume";

const { Title } = Typography;

const Item = ({ color, children }: { color: Color; children: ReactNode }) => {
  return (
    <Box style={{ display: "flex", alignItems: "center" }}>
      <Box
        style={{ position: "relative", marginRight: "8px" }}
        className={`ns-timeline-item-head ns-timeline-item-head-${color}`}
      />
      {children}
    </Box>
  );
};

export const Legend = () => {
  return (
    <Box
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
      }}
    >
      <Card bodyStyle={{ padding: 16 }}>
        <Title level={5}>Legend</Title>
        <Item color={Color.blue}>Education</Item>
        <Item color={Color.red}>Tech experience</Item>
        <Item color={Color.gray}>Other experience</Item>
      </Card>
    </Box>
  );
};
