import { useMemo } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import NoBoard from "routes/Home/Boards/NoBoard";
import { useBoards } from "routes/Home/Boards/Provider";

const Boards = () => {
  const { boardId } = useParams();
  const { boards } = useBoards();

  const isBoardAvailable = useMemo(() => {
    return boards?.find((board) => board.id === boardId);
  }, [boardId, boards]);

  if (!isBoardAvailable && boards?.[0]?.id) {
    return <Navigate to={boards?.[0]?.id} />;
  }

  if (!boards?.length) {
    return <NoBoard />;
  }

  return <Outlet />;
};

export default Boards;
