import useDefaultBoardTab from "hooks/useDefaultBoardTab";
import { FC } from "react";
import { Navigate } from "react-router-dom";
import { useBoard } from "routes/Home/Boards/Board/Provider";

const BoardRedirect: FC = () => {
  const defaultBoardTab = useDefaultBoardTab();
  const { board } = useBoard();

  if (board) {
    return <Navigate to={`/boards/${board.id}/${defaultBoardTab}`} />;
  }

  return null;
};

export default BoardRedirect;
