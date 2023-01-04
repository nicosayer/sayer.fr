import { useLocalStorage } from "@mantine/hooks";
import usePathname from "hooks/usePathname";
import { useEffect } from "react";

const useDefaultBoardTab = () => {
  const [defaultBoardTab, setDefaultBoardTab] = useLocalStorage({
    key: "default-board-tab",
    defaultValue: "credentials",
    getInitialValueInEffect: false,
  });

  const { pathnames } = usePathname();

  useEffect(() => {
    if (pathnames[2]) {
      setDefaultBoardTab(pathnames[2]);
    }
  }, [pathnames, setDefaultBoardTab]);

  return defaultBoardTab;
};

export default useDefaultBoardTab;
