import { ConfigProvider } from "antd";
import React, { ReactNode } from "react";

const PREFIX_CLASSNAME = "ns";

ConfigProvider.config({
  prefixCls: PREFIX_CLASSNAME,
});

export const AntdProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ConfigProvider prefixCls={PREFIX_CLASSNAME}>{children}</ConfigProvider>
  );
};
