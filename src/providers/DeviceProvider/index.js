import React, { useContext, useEffect, useMemo, useState } from "react";
import { MOBILE_COMPUTER_BREAKPOINT } from "config/enums";
import isWebview from "is-ua-webview";
import { isBrowser, isMobile } from "react-device-detect";

const DeviceContext = React.createContext();

export const useDevice = () => useContext(DeviceContext);

export const DeviceProvider = ({ children }) => {
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

  const isComputerSize = useMemo(
    () => windowSize > MOBILE_COMPUTER_BREAKPOINT,
    [windowSize]
  );

  return (
    <DeviceContext.Provider
      value={{
        isComputer: isBrowser,
        isComputerSize: isComputerSize,
        isMobile,
        isMobileSize: !isComputerSize,
        isWebview: isWebview(navigator.userAgent),
      }}
    >
      {windowSize ? children : null}
    </DeviceContext.Provider>
  );
};
