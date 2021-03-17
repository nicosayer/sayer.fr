import { Avatar as AntdAvatar } from "antd";
import React from "react";

import avatar from "pages/Home/Timeline/Avatar/ns.png";

export const Avatar = () => {
  return (
    <AntdAvatar size="large" src={avatar}>
      NS
    </AntdAvatar>
  );
};
