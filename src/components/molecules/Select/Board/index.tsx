import { Select, SelectProps } from "@mantine/core";
import { FC } from "react";
import { BoardDocument } from "types/firebase/collections";

export interface BoardSelectProps extends Omit<SelectProps, "data"> {
  boards: BoardDocument[];
}

const BoardSelect: FC<BoardSelectProps> = ({ boards, ...rest }) => {
  return (
    <Select
      data={(boards ?? []).map((board) => {
        return { label: board.name, value: String(board.id) };
      })}
      {...rest}
    />
  );
};

export default BoardSelect;
