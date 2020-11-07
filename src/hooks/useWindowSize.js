import { useEffect, useMemo, useState } from "react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      function handleResize() {
        setWindowSize(window.innerWidth);
      }

      window.addEventListener("resize", handleResize);

      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const isOnComputer = useMemo(() => windowSize > 768, [windowSize]);

  if (!windowSize) {
    return { loading: true };
  }

  return { isOnMobile: !isOnComputer, isOnComputer, loading: false };
};
