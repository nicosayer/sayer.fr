import { useLocalStorage } from "@mantine/hooks";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const useDefaultBoardId = () => {
  const { boardId } = useParams();
  const [defaultBoardId, setDefaultBoardId] = useLocalStorage({
    key: "default-board-id",
    getInitialValueInEffect: false,
  });

  useEffect(() => {
    if (boardId) {
      setDefaultBoardId(boardId);
    }
  }, [boardId, setDefaultBoardId]);

  return defaultBoardId;
};

export default useDefaultBoardId;
