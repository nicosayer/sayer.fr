import { Select, SelectProps } from "@mantine/core";
import { FC } from "react";
import { BoardDocument } from "types/firebase/collections";

export interface BoardSelectProps extends Omit<SelectProps, "data"> {
  loading: boolean;
  boards: BoardDocument[];
}

const BoardSelect: FC<BoardSelectProps> = ({ loading, boards, ...rest }) => {
  return (
    <Select
      withinPortal
      disabled={loading}
      withAsterisk
      data={(boards ?? []).map((board) => {
        return { label: board.name, value: String(board.id) };
      })}
      placeholder="Board de John Doe"
      {...rest}
    />
  );
};

export default BoardSelect;
