import React, { useContext, useEffect, useMemo, useState } from "react";
import { MOBILE_COMPUTER_BREAKPOINT } from "config/enums";

const WindowSizeContext = React.createContext();

export const useWindowSize = () => useContext(WindowSizeContext);

export const WindowSizeProvider = ({ children }) => {
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

  const isOnComputer = useMemo(() => windowSize > MOBILE_COMPUTER_BREAKPOINT, [
    windowSize,
  ]);

  return (
    <WindowSizeContext.Provider
      value={{
        isOnMobile: !isOnComputer,
        isOnComputer: isOnComputer,
      }}
    >
      {windowSize ? children : null}
    </WindowSizeContext.Provider>
  );
};
