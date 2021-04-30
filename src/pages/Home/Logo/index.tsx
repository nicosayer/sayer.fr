import { x } from "@xstyled/emotion";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

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
  const [music, setMusic] = useState<HTMLAudioElement>();

  useEffect(() => {
    setMusic(
      new Audio(process.env.PUBLIC_URL + "/sounds/TooLateToTurnBackNow.mp3")
    );
  }, []);

  useEffect(() => {
    console.log(music, hover);
    if (music) {
      if (hover) {
        music.play();
      } else {
        music.pause();
      }
    }
  }, [hover, music]);

  return (
    <x.div
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
    >
      <x.div
        fontFamily="Caslon"
        fontSize={64}
        cursor={`url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='96' viewport='0 0 100 100' style='fill:black;font-size:48px;'><text y='50%'>🎉</text></svg>") 16 0, auto`}
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
        <Confetti numberOfPieces={hover ? 200 : 0} />
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
