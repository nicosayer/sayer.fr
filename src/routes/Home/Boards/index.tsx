import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useMemo } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import NewBoard from "routes/Home/Boards/NewBoard";
import { useBoards } from "routes/Home/Boards/Provider";

const Boards = () => {
  const params = useParams();
  const [boardId, setBoardId] = useLocalStorage<string>({
    key: "board-id",
  });
  const { boards } = useBoards();

  const isBoardAvailable = useMemo(() => {
    return boards?.find((board) => board.id === boardId);
  }, [boardId, boards]);

  useEffect(() => {
    if (!isBoardAvailable && boards?.[0]?.id) {
      setBoardId(boards[0].id);
    }
  }, [boards, isBoardAvailable, setBoardId]);

  if (!params.boardId && isBoardAvailable) {
    return <Navigate to={boardId} />;
  }

  if (boards?.[0]?.id) {
    return <Outlet />;
  }

  return <NewBoard />;
};

export default Boards;
