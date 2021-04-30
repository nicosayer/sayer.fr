import { MenuOutlined } from "@ant-design/icons";
import { x } from "@xstyled/emotion";
import { Button, Dropdown, Menu } from "antd";
import React from "react";

import useIsMobile from "hooks/useIsMobile";

const Header = ({ openRoute }: { openRoute: (route?: number) => void }) => {
  const isMobile = useIsMobile();

  return (
    <x.div
      zIndex={1000}
      background={isMobile ? "#d5eee8" : undefined}
      position="fixed"
      h={64}
      left={0}
      right={0}
      top={0}
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      marginRight={isMobile ? 16 : 64}
    >
      <Dropdown
        placement="bottomRight"
        trigger={isMobile ? ["click"] : undefined}
        overlay={
          <Menu>
            <Menu.Item
              onClick={() => {
                openRoute(1);
              }}
              style={{ fontSize: 16 }}
            >
              LE PROGRAMME
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                openRoute(2);
              }}
              style={{ fontSize: 16 }}
            >
              S&apos;Y RENDRE
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                openRoute(3);
              }}
              style={{ fontSize: 16 }}
            >
              OÙ DORMIR
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item style={{ fontSize: 16 }}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://forms.gle/Gn8T7gHDdzjsHtRz6"
              >
                RSVP
              </a>
            </Menu.Item>
          </Menu>
        }
      >
        <Button type="text" icon={<MenuOutlined />} size="large">
          MENU
        </Button>
      </Dropdown>
    </x.div>
  );
};

export default Header;
