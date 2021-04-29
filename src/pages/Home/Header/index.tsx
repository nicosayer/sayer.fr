import { useWindowWidth } from "@react-hook/window-size";
import { x } from "@xstyled/emotion";
import React from "react";
const Header = ({ openRoute }: { openRoute: (route?: number) => void }) => {
  const windowWidth = useWindowWidth();

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
        {windowWidth < 768 ? "" : "LE"} PROGRAMME
      </x.div>
      <x.div
        cursor="pointer"
        hoverColor="#22222290"
        transition="all 0.2s"
        onClick={() => {
          openRoute(2);
        }}
      >
        {windowWidth < 768 ? "" : "COMMENT"} VENIR
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
