import { x } from "@xstyled/emotion";
import { Card, Divider, Typography, List } from "antd";
import React from "react";

const { Title, Text, Link } = Typography;

const renderItem = ({
  name,
  distance,
  url,
  city,
}: {
  name: string;
  city: string;
  distance: string;
  url: string;
}) => (
  <List.Item>
    <div>
      <Text strong>{name}</Text>
      <div>
        <Text>{city}</Text> · <Text type="secondary">{distance}</Text> ·{" "}
        <Link href={url} target="_blank">
          Site web
        </Link>
      </div>
    </div>
  </List.Item>
);

const Coming = () => {
  return (
    <x.div margin="auto" w="fit-content" px={16} pb={64} pt={64} maxWidth={800}>
      <Card>
        <x.span fontFamily="Caslon">
          <Title level={3}>Où dormir</Title>
        </x.span>
        <Divider />
        <List
          header={<Title level={4}>Sur place</Title>}
          footer={<Title level={4} />}
          dataSource={[
            <List.Item key={1}>
              Nous allons installer des tipis sur le terrain afin de pouvoir
              loger un maximum d&apos;entre vous ! Si vous êtes intéressés,
              écrivez-nous à{" "}
              <Link
                href="mailto:charlottenicolasmariage@gmail.com"
                target="_blank"
              >
                charlottenicolasmariage@gmail.com
              </Link>
              .
            </List.Item>,
          ]}
          renderItem={(a) => a}
        />
        <List
          header={<Title level={4}>Hôtels</Title>}
          footer={
            <>
              Et pleins d&apos;autres hôtels en{" "}
              <Link
                href="https://www.google.com/travel/hotels/Glanville"
                target="_blank"
              >
                cliquant ici
              </Link>
            </>
          }
          dataSource={[
            {
              name: "Le Clos Devalpierre",
              city: "Glanville",
              distance: "1 km",
              url: "https://chambres-dhotes-devalpierre.com/",
            },
            {
              name: "La Ferme du Lieu Bourg",
              city: "Saint-Pierre-Azif",
              distance: "4 km",
              url: "http://www.fermedulieubourg.fr/",
            },
            {
              name: "Les Manoirs de Tourgéville",
              city: "Tourgéville",
              distance: "5 km",
              url: "https://www.lesmanoirstourgeville.com/",
            },
            {
              name: "Hotel le P'tit Beaumont",
              city: "Beaumont-en-Auge",
              distance: "5 km",
              url: "http://www.leptitbeaumont.fr/",
            },
            {
              name: "Le Moulin des 4 Vaux",
              city: "Saint-Étienne-la-Thillaye",
              distance: "5 km",
              url: "http://www.gitemoulindes4vaux.com/",
            },
            {
              name: "Opus 15",
              city: "Beaumont-en-Auge",
              distance: "5 km",
              url: "http://opus15-beaumont.com/",
            },
            {
              name: "L'Herbe aux Vaches",
              city: "Saint-Pierre-Azif",
              distance: "6 km",
              url:
                "https://lherbe-aux-vaches-chambre-hote-deauville.business.site/",
            },
          ]}
          renderItem={renderItem}
        />
        <List
          header={<Title level={4}>Gîtes</Title>}
          footer={
            <>
              Et pleins d&apos;autres gîtes en{" "}
              <Link
                href="https://www.gites-de-france.com/fr/search?destination=Glanville&towns=40933"
                target="_blank"
              >
                cliquant ici
              </Link>
            </>
          }
          dataSource={[
            {
              name: "Les Maisons de Charlotte",
              city: "Glanville",
              distance: " 1km",
              url: "https://www.lesmaisonsdecharlotte.com/",
            },
            {
              name: "Le Houley",
              city: "Glanville",
              distance: " 1km",
              url:
                "https://www.gites-de-france.com/fr/normandie/calvados/le-houley-14g3045?travelers=2",
            },
            {
              name: "Le Clos en Auge",
              city: "Bourgeauville",
              distance: " 3km",
              url: "http://le-clos-en-auge.com/",
            },
            {
              name: "La Fermette des Mares",
              city: "Tourgéville",
              distance: " 6km",
              url:
                "https://www.gites.fr/gites_la-fermette-des-mares_tourgeville_41438.htm",
            },
          ]}
          renderItem={renderItem}
        />
      </Card>
    </x.div>
  );
};

export default Coming;
