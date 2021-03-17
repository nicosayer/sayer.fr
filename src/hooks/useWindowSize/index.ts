import { useEffect, useState } from "react";

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export const useIsLaptopWindowSize = () => {
  const { width } = useWindowSize();

  return width > 1024;
};

export const useIsMobileWindowSize = () => {
  const { width } = useWindowSize();

  return width <= 425;
};
