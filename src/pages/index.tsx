import React from "react";

import { Home } from "pages/Home";
import { AntdProvider } from "providers/Antd";

export const App = () => {
  return (
    <AntdProvider>
      <Home />
    </AntdProvider>
  );
};
