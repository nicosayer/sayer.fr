import { Badge, Select, SelectProps } from "@mantine/core";
import { FC } from "react";
import { BoardDocument } from "types/firebase/collections";
import { getColorFromString } from "utils/color";

export interface TagSelectProps extends Omit<SelectProps, "data"> {
  loading?: boolean;
  board: BoardDocument;
}

const TagSelect: FC<TagSelectProps> = ({ loading, board, ...rest }) => {
  return (
    <Select
      disabled={loading}
      data={board?.tags ?? []}
      itemComponent={({ value, ...rest }) => {
        return (
          <div {...rest}>
            <Badge variant="dot" color={getColorFromString(value)}>
              {value}
            </Badge>
          </div>
        );
      }}
      clearable
      styles={(theme) => ({
        item: {
          "&[data-selected]": {
            "&, &:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.gray[9]
                  : theme.white,
            },
            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.gray[8]
                  : theme.colors.gray[1],
            },
          },
        },
      })}
      {...rest}
    />
  );
};

export default TagSelect;
