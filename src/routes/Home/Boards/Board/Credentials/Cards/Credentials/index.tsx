import { Card } from "@mantine/core";
import { FC } from "react";
import { useBoard } from "routes/Home/Boards/Board/Provider";

const CredentialsCards: FC = () => {
  const { credentials } = useBoard();
  console.log(credentials);

  return <Card withBorder>Hello</Card>;
};

export default CredentialsCards;
