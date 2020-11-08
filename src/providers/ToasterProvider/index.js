import React, { useContext, useRef } from "react";

import { Toaster } from "@blueprintjs/core";

const ToasterContext = React.createContext();

export const useToaster = () => useContext(ToasterContext);

export const ToasterProvider = ({ children }) => {
  const toasterRef = useRef();

  return (
    <ToasterContext.Provider
      value={{
        toast: (options = {}) => {
          toasterRef.current?.show(options);
        },
      }}
    >
      <Toaster ref={toasterRef} />
      {children}
    </ToasterContext.Provider>
  );
};
