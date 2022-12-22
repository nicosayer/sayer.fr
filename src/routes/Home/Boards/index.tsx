import { useMemo } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import NoBoard from "routes/Home/Boards/NoBoard";
import { useBoards } from "routes/Home/Boards/Provider";
import { ALL_BOARDS_SLUG } from "utils/boards";

const Boards = () => {
  const { boardId } = useParams();
  const { boards } = useBoards();

  const isBoardAvailable = useMemo(() => {
    return (
      boardId === ALL_BOARDS_SLUG ||
      boards?.find((board) => board.id === boardId)
    );
  }, [boardId, boards]);

  if (!boardId && boards?.[0]?.id) {
    return <Navigate to={ALL_BOARDS_SLUG} />;
  }

  if (isBoardAvailable) {
    return <Outlet />;
  }

  return <NoBoard />;
};

export default Boards;
