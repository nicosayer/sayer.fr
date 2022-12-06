import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const usePathname = () => {
  const location = useLocation();

  return useMemo(() => {
    const pathnames = location.pathname.split("/").filter(Boolean);

    return { pathname: location.pathname, pathnames };
  }, [location.pathname]);
};

export default usePathname;
