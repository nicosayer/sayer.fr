import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useMemo } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import NoBoard from "routes/Home/Boards/NoBoard";
import { useBoards } from "routes/Home/Boards/Provider";
import { ALL_BOARDS_SLUG } from "utils/boards";

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
      setBoardId(boards.length === 1 ? boards?.[0]?.id : ALL_BOARDS_SLUG);
    }
  }, [boards, isBoardAvailable, setBoardId]);

  if (!params.boardId && (isBoardAvailable || boardId === ALL_BOARDS_SLUG)) {
    return <Navigate to={boardId} />;
  }

  if (boards?.[0]?.id) {
    return <Outlet />;
  }

  return <NoBoard />;
};

export default Boards;
