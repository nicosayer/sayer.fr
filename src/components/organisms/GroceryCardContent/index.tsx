import {
  ActionIcon,
  Badge,
  Checkbox,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons";
import { deleteDoc, updateDoc } from "firebase/firestore";
import { FC } from "react";
import { GroceryDocument } from "types/firebase/collections";
import { getColorFromString } from "utils/color";
import { formatDate } from "utils/dayjs";

export interface GroceryCardContentProps {
  grocery: GroceryDocument;
}

const GroceryCardContent: FC<GroceryCardContentProps> = ({ grocery }) => {
  const is768Px = useMediaQuery("(min-width: 768px)");

  return (
    <Group position="apart" noWrap className="whitespace-nowrap">
      <Checkbox
        checked={Boolean(grocery.closeDate)}
        className="flex overflow-hidden"
        classNames={{
          input: "cursor-pointer",
          label: "cursor-pointer",
        }}
        label={grocery.name}
        onChange={() => {
          if (grocery.ref && grocery.closeDate) {
            updateDoc<GroceryDocument>(grocery.ref, {
              closeDate: "",
              closedBy: "",
            });
          }
        }}
      />
      <Group>
        {grocery.tag && (
          <Badge variant="dot" color={getColorFromString(grocery.tag)}>
            {grocery.tag}
          </Badge>
        )}
        {is768Px && (
          <Text c="dimmed" fz="sm">
            {grocery.closeDate
              ? `acheté par ${grocery.closedBy} le ${formatDate(
                  grocery.closeDate
                )}`
              : `ajouté par ${grocery.openedBy} le ${formatDate(
                  grocery.openDate
                )}`}
          </Text>
        )}
        {grocery.closeDate && (
          <Tooltip label="Supprimer" withinPortal>
            <ActionIcon
              variant="subtle"
              color="red"
              size="sm"
              onClick={() => {
                if (grocery.ref) {
                  deleteDoc(grocery.ref);
                }
              }}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Group>
  );
};

export default GroceryCardContent;
