import { x } from "@xstyled/emotion";
import React, { useState } from "react";

import useIsMobile from "hooks/useIsMobile";

const Logo = ({
  route,
  openRoute,
}: {
  route?: number;
  openRoute: (route?: number) => void;
}) => {
  const [hover, setHover] = useState(false);
  const isMobile = useIsMobile();

  return (
    <x.div
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="space-around"
      textAlign="center"
    >
      <x.div
        fontFamily="Caslon"
        fontSize={64}
        cursor="pointer"
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
        onClick={() => {
          if (!isMobile) {
            openRoute(route ? undefined : 1);
          }
        }}
      >
        <x.span
          textDecoration={hover ? "line-through" : "auto"}
          opacity={hover ? 0.4 : 1}
          transition="all 0.4s"
        >
          charlotte
          <br />& nicolas
        </x.span>
        <x.div h={hover ? 100 : 0} overflow="hidden" transition="all 0.4s">
          octave
        </x.div>
      </x.div>
    </x.div>
  );
};

export default Logo;
