import { useLocalStorage } from "@mantine/hooks";
import { useMemo } from "react";

const useDefaultBoardId = () => {
  const [defaultBoardId, setDefaultBoardId] = useLocalStorage({
    key: "default-board-id",
    getInitialValueInEffect: false,
  });

  return useMemo(() => {
    return { defaultBoardId, setDefaultBoardId };
  }, [defaultBoardId, setDefaultBoardId]);
};

export default useDefaultBoardId;
