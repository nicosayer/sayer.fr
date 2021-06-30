import { x } from "@xstyled/emotion";
import { Card, Divider, Timeline, Typography } from "antd";
import React from "react";

const { Text, Title } = Typography;

const Program = () => {
  return (
    <x.div margin="auto" w="fit-content" px={16} pb={64} pt={64}>
      <Card>
        <x.span fontFamily="Caslon">
          <Title level={3}>Le programme</Title>
        </x.span>
        <Divider />
        <Timeline>
          <Timeline.Item>
            <Text strong>Samedi 10 juillet</Text>
          </Timeline.Item>
          <Timeline.Item>
            <Text strong>12h</Text>
            <div>
              <Text type="secondary">Église de Glanville</Text>
            </div>
            Bapteme d&apos;Octave
          </Timeline.Item>
          <Timeline.Item>
            <Text strong>13h</Text>
            <div>
              <Text type="secondary">Haras de la Huderie</Text>
            </div>
            Déjeuner sur le pouce (food truck)
          </Timeline.Item>
          <Timeline.Item>
            <Text strong>17h</Text>
            <div>
              <Text type="secondary">Mairie de Glanville</Text>
            </div>
            Mariage de Charlotte & Nicolas
          </Timeline.Item>
          <Timeline.Item>
            <Text strong>18h30</Text>
            <div>
              <Text type="secondary">Haras de la Huderie</Text>
            </div>
            Cocktail, diner et fête !
          </Timeline.Item>
          <Timeline.Item color="red">
            <Text strong>Dimanche 11 juillet</Text>
          </Timeline.Item>
          <Timeline.Item color="red">
            <Text strong>11h</Text>
            <div>
              <Text type="secondary">Haras de la Huderie</Text>
            </div>
            Brunch
          </Timeline.Item>
        </Timeline>
      </Card>
    </x.div>
  );
};

export default Program;
