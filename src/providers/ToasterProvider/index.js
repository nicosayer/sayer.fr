import React, { useContext, useRef } from "react";

import { Intent, Position, Toaster } from "@blueprintjs/core";

const ToasterContext = React.createContext();

export const useToaster = () => useContext(ToasterContext);

export const ToasterProvider = ({ children }) => {
  const toasterRef = useRef();

  return (
    <ToasterContext.Provider
      value={{
        toaster: toasterRef,
        success: (options = {}) => {
          toasterRef.current?.show({
            intent: Intent.SUCCESS,
            timeout: 2000,
            ...options,
          });
        },
        danger: (options = {}) => {
          toasterRef.current?.show({
            intent: Intent.DANGER,
            timeout: 2000,
            ...options,
          });
        },
        primary: (options = {}) => {
          toasterRef.current?.show({
            intent: Intent.PRIMARY,
            timeout: 2000,
            ...options,
          });
        },
      }}
    >
      <Toaster position={Position.BOTTOM} ref={toasterRef} maxToasts={3} />
      {children}
    </ToasterContext.Provider>
  );
};
