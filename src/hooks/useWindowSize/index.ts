import { MantineSize, px, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";

const useWindowSize = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const { breakpoints } = useMantineTheme();

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    width,
    largerThan: (breakpoint: MantineSize) => {
      return width >= Number(breakpoints[breakpoint].slice(0, 2)) * px("1rem");
    },
    smallerThan: (breakpoint: MantineSize) => {
      return width <= Number(breakpoints[breakpoint].slice(0, 2)) * px("1rem");
    },
  };
};

export default useWindowSize;
