import { Card } from "@mantine/core";
import ListCardContent from "components/organisms/ListCardContent";
import { FC } from "react";
import { ListDocument, ListItemDocument } from "types/firebase/collections";

export interface ListCardProps {
  list: ListDocument;
  listItems: ListItemDocument[];
}

const ListCard: FC<ListCardProps> = ({ list, listItems }) => {
  return (
    <Card withBorder>
      <ListCardContent list={list} listItems={listItems} />
    </Card>
  );
};

export default ListCard;
