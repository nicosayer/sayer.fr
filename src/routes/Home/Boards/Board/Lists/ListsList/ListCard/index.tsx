import { Card } from "@mantine/core";
import ListCardContent from "components/organisms/ListCardContent";
import { FC } from "react";
import { ListDocument } from "types/firebase/collections";

export interface ListCardProps {
  list: ListDocument;
}

const ListCard: FC<ListCardProps> = ({ list }) => {
  return (
    <Card withBorder>
      <ListCardContent list={list} />
    </Card>
  );
};

export default ListCard;
