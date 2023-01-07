import useDefaultBoardId from "hooks/useDefaultBoardId";
import { useMemo } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import NoBoard from "routes/Home/Boards/NoBoard";
import { useBoards } from "routes/Home/Boards/Provider";

const Boards = () => {
  const { boardId } = useParams();
  const { boards } = useBoards();
  const defaultBoardId = useDefaultBoardId();

  const isBoardAvailable = useMemo(() => {
    return boards?.find((board) => board.id === boardId);
  }, [boardId, boards]);

  const isDefaultBoardAvailable = useMemo(() => {
    return boards?.find((board) => board.id === defaultBoardId);
  }, [defaultBoardId, boards]);

  if (!boardId && isDefaultBoardAvailable) {
    return <Navigate to={defaultBoardId} />;
  }

  if (!boardId && boards?.[0]?.id) {
    return <Navigate to={boards?.[0]?.id} />;
  }

  if (isBoardAvailable) {
    return <Outlet />;
  }

  return <NoBoard />;
};

export default Boards;
