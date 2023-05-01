import {
  ActionIcon,
  Badge,
  MultiSelect,
  MultiSelectProps,
  MultiSelectValueProps,
  SelectItemProps,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { FC, forwardRef } from "react";
import { TagDocument } from "types/firebase/collections";

export interface TagsMultiSelectProps extends Omit<MultiSelectProps, "data"> {
  tags: TagDocument[];
}

const ItemComponent = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ label, value, color, ...rest }: SelectItemProps, ref) => (
    <div ref={ref} {...rest}>
      <Badge variant="dot" color={color}>
        {label}
      </Badge>
    </div>
  )
);

const ValueComponent = forwardRef<
  HTMLDivElement,
  MultiSelectValueProps & { value: string }
>(
  (
    {
      label,
      value,
      color,
      onRemove,
      ...rest
    }: MultiSelectValueProps & { value: string },
    ref
  ) => (
    <div ref={ref} {...rest}>
      <Badge
        variant="dot"
        color={color}
        rightSection={
          <ActionIcon
            size="xs"
            variant="transparent"
            className="-mr-[6px]"
            onClick={onRemove}
          >
            <IconX size={10} />
          </ActionIcon>
        }
      >
        {label}
      </Badge>
    </div>
  )
);

const TagsMultiSelect: FC<TagsMultiSelectProps> = ({ tags, ...rest }) => {
  return (
    <MultiSelect
      data={tags.map((tag) => {
        return {
          label: String(tag.name),
          value: String(tag.ref?.path),
          color: tag.color,
        };
      })}
      itemComponent={ItemComponent}
      valueComponent={ValueComponent}
      clearable
      {...rest}
    />
  );
};

export default TagsMultiSelect;
