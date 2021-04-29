import { x } from "@xstyled/emotion";
import React, { useState } from "react";

const Logo = ({
  route,
  openRoute,
}: {
  route?: number;
  openRoute: (route?: number) => void;
}) => {
  const [hover, setHover] = useState(false);

  return (
    <x.div padding={64} h="100%">
      <x.div
        fontFamily="Caslon"
        fontSize={64}
        display="flex"
        alignItems="center"
        justifyContent="space-around"
        h="100%"
        textAlign="center"
      >
        <x.div
          onMouseEnter={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
          cursor="pointer"
          onClick={() => {
            openRoute(route ? undefined : 1);
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
    </x.div>
  );
};

export default Logo;
