import { x } from "@xstyled/emotion";
import { Card, Divider, Typography } from "antd";
import React from "react";

const { Title } = Typography;

const Coming = () => {
  return (
    <x.div margin="auto" w="fit-content" px={16} pb={64} pt={128}>
      <Card>
        <x.span fontFamily="Caslon">
          <Title level={3}>Coming venir</Title>
        </x.span>
        <Divider />
        <x.div position="relative" textAlign="right" h={400} w="100%">
          <x.div
            overflow="hidden"
            background="none !important"
            h={400}
            w="100%"
          >
            <iframe
              width="100%"
              height="100%"
              id="gmap_canvas"
              src="https://maps.google.com/maps?q=haras%20de%20la%20huderie&t=&z=13&ie=UTF8&iwloc=&output=embed"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
            ></iframe>
          </x.div>
        </x.div>
      </Card>
    </x.div>
  );
};

export default Coming;
