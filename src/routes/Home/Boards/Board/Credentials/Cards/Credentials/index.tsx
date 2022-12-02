import { Card } from "@mantine/core";
import { FC } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";

const CredentialsCards: FC = () => {
  const { board } = useBoard();

  return <Card withBorder>Hello</Card>;
};

export default CredentialsCards;
