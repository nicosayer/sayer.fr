import { Badge } from "@mantine/core";
import { FC, useMemo } from "react";
import { useBoards } from "routes/Home/Boards/Provider";

interface TagBadgeProps {
  tagId?: string;
}

const TagBadge: FC<TagBadgeProps> = ({ tagId }) => {
  const { tags } = useBoards();

  const tag = useMemo(() => {
    return tags?.find((tag) => {
      return tag.id === tagId;
    });
  }, [tags, tagId]);

  if (!tag) {
    return null;
  }

  return <Badge color={tag.color}>{tag.name}</Badge>;
};

export default TagBadge;
