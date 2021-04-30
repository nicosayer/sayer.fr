import { x } from "@xstyled/emotion";
import React from "react";

import useIsMobile from "hooks/useIsMobile";

const Header = ({ openRoute }: { openRoute: (route?: number) => void }) => {
  const isMobile = useIsMobile();

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
        {isMobile ? "" : "LE"} PROGRAMME
      </x.div>
      <x.div
        cursor="pointer"
        hoverColor="#22222290"
        transition="all 0.2s"
        onClick={() => {
          openRoute(2);
        }}
      >
        {isMobile ? "" : "COMMENT"} VENIR
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
