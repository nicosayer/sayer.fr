import { useEffect, useState } from "react";

export const useIsMobile = () => {
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

  if (!windowSize) {
    return undefined;
  }

  return windowSize < 769;
};
