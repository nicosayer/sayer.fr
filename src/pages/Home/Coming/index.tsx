import { x } from "@xstyled/emotion";
import { Card, Divider, Typography, List } from "antd";
import React from "react";

const { Title, Text } = Typography;

const renderItem = ({
  name,
  distance,
  description,
}: {
  name: string;
  distance: string;
  description: string;
}) => (
  <List.Item>
    <Text strong>{name}</Text> · <Text type="secondary">{distance}</Text> ·{" "}
    {description}
  </List.Item>
);

const Coming = () => {
  return (
    <x.div margin="auto" w="fit-content" px={16} pb={64} pt={64}>
      <Card>
        <x.span fontFamily="Caslon">
          <Title level={3}>Comment venir</Title>
        </x.span>
        <Divider />
        <List
          header={<Title level={4}>Avion</Title>}
          footer={<Title level={4} />}
          dataSource={[
            {
              name: "Aéroport Caen Carpiquet",
              distance: "50 km",
              description: "Puis vous pouvez louer une voiture.",
            },
            {
              name: "Aéroports de Paris CDG ou Orly",
              distance: "250 km",
              description: "Puis vous pouvez louer une voiture.",
            },
          ]}
          renderItem={renderItem}
        />
        <List
          header={<Title level={4}>Train</Title>}
          footer={<Title level={4} />}
          dataSource={[
            {
              name: "Gare de Deauville",
              distance: "12 km",
              description: "Puis vous pouvez louer une voiture chez Avis.",
            },
            {
              name: "Gare de Pont-l'Évêque",
              distance: "12 km",
              description: "Puis vous pouvez prendre un taxi.",
            },
          ]}
          renderItem={renderItem}
        />
        <List
          header={<Title level={4}>Voiture</Title>}
          footer={<Title level={4} />}
          dataSource={[
            {
              name: "Depuis Paris",
              distance: "2h - 200 km",
              description: "Prendre A13 direction Caen, puis sortie 29A.",
            },
            {
              name: "Depuis Lyon",
              distance: "6h - 650 km",
              description:
                "Prendre A6 direction Paris,puis A13 direction Caen, puis sortie 29A.",
            },
          ]}
          renderItem={renderItem}
        />
        <x.div position="relative" textAlign="right" h={500} w="100%">
          <x.div
            overflow="hidden"
            background="none !important"
            h={500}
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
