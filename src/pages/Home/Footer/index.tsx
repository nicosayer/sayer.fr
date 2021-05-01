import { x } from "@xstyled/emotion";
import { Typography } from "antd";
import React from "react";

const { Text } = Typography;

const Footer = () => {
  return (
    <x.div
      margin="auto"
      w="fit-content"
      px={16}
      pb={64}
      pt={64}
      maxWidth={800}
      textAlign="center"
    >
      <Text type="secondary">Sayer © 2021</Text>
    </x.div>
  );
};

export default Footer;
