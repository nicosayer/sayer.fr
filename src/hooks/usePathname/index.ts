import { last } from "lodash";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const usePathname = () => {
  const location = useLocation();

  return useMemo(() => {
    const pathnames = location.pathname.split("/");
    return { pathname: location.pathname, pathnames, last: last(pathnames) };
  }, [location.pathname]);
};

export default usePathname;
