import { MenuOutlined } from "@ant-design/icons";
import { x } from "@xstyled/emotion";
import { Button, Dropdown, Menu } from "antd";
import React from "react";

import useIsMobile from "hooks/useIsMobile";

const Header = ({ openRoute }: { openRoute: (route?: number) => void }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <x.div
        zIndex={1000}
        background="#d5eee8"
        position="fixed"
        h={64}
        left={0}
        right={0}
        top={0}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        marginRight={16}
      >
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                onClick={() => {
                  openRoute(1);
                }}
              >
                LE PROGRAMME
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  openRoute(2);
                }}
              >
                COMMENT VENIR
              </Menu.Item>
              <Menu.Item>
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
  }

  return (
    <x.div
      zIndex={1000}
      background="#d5eee8"
      position="fixed"
      h={64}
      left={0}
      right={0}
      top={0}
      display="grid"
      gridTemplateColumns="1fr 1fr 1fr"
      alignItems="center"
      justifyContent="space-around"
      fontSize="larger"
      textAlign="center"
      whiteSpace="nowrap"
    >
      <x.div
        cursor="pointer"
        hoverColor="#22222290"
        transition="all 0.2s"
        onClick={() => {
          openRoute(1);
        }}
      >
        LE PROGRAMME
      </x.div>
      <x.div
        cursor="pointer"
        hoverColor="#22222290"
        transition="all 0.2s"
        onClick={() => {
          openRoute(2);
        }}
      >
        COMMENT VENIR
      </x.div>
      <x.a
        cursor="pointer"
        color="#222222"
        hoverColor="#22222290"
        transition="all 0.2s"
        href="https://forms.gle/Gn8T7gHDdzjsHtRz6"
        target="_blank"
      >
        RSVP
      </x.a>
    </x.div>
  );
};

export default Header;
