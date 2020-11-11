import React from "react";

export const ComponentOrChildren = ({
  componentProps,
  component,
  children,
  disabled,
}) => {
  if (disabled) {
    return children;
  }

  const Component = component;

  return <Component {...componentProps}>{children}</Component>;
};
