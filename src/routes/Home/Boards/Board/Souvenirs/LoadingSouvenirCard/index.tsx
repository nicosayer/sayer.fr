import { Card, Image, Text } from "@mantine/core";
import LoadingOverlay from "components/atoms/LoadingOverlay";
import { FC } from "react";
import { SouvenirDocument } from "types/firebase/collections";

export interface LoadingSouvenirCardProps {
  souvenir: SouvenirDocument;
}

const LoadingSouvenirCard: FC<LoadingSouvenirCardProps> = ({ souvenir }) => {
  return (
    <Card withBorder>
      <Card.Section>
        <Image
          withPlaceholder
          height={200}
          placeholder={<LoadingOverlay visible />}
        />
      </Card.Section>
      <Text mt="md" c="dimmed">
        {souvenir.description}
      </Text>
    </Card>
  );
};

export default LoadingSouvenirCard;
