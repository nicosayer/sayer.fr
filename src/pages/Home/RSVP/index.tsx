import { x } from "@xstyled/emotion";
import { Card, Divider, Typography, Button, Space } from "antd";
import React from "react";

const { Title } = Typography;

const RSVP = () => {
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
      <Card>
        <x.span fontFamily="Caslon">
          <Title level={3}>RSVP</Title>
        </x.span>
        <Divider />
        <Button
          size="large"
          type="primary"
          href="https://forms.gle/Gn8T7gHDdzjsHtRz6"
          target="_blank"
        >
          Je serai présent à cet évènement !
        </Button>
      </Card>
    </x.div>
  );
};

export default RSVP;
